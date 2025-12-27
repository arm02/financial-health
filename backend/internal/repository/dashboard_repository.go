package repository

import (
	"context"
	"database/sql"
	"errors"
	"financial-health/internal/domain"
	"time"
)

type DashboardRepositoryImpl struct {
	db *sql.DB
}

func NewDashboardRepository(db *sql.DB) domain.DashboardRepository {
	return &DashboardRepositoryImpl{db}
}

func (r *DashboardRepositoryImpl) GetTotalsByDateRange(
	ctx context.Context,
	userID int64,
	startDate, endDate time.Time,
) (domain.Dashboard, error) {

	query := `
		WITH loan_data AS (
			SELECT 
				SUM(ld.amount) AS total_loans,
				SUM(CASE WHEN ld.status = 'unpaid' THEN ld.amount ELSE 0 END) AS total_remaining_loan
			FROM loan_details ld
			JOIN loans l ON l.id = ld.loan_id
			WHERE l.user_id = ?
			AND ld.due_date BETWEEN ? AND ?
		),
		trans_data AS (
			SELECT
				SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) AS total_income,
				SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) AS total_outcome
			FROM transactions
			WHERE user_id = ?
			AND transaction_date BETWEEN ? AND ?
		),
		expense_data AS (
			SELECT SUM(amount) AS total_expenses
			FROM expenses
			WHERE user_id = ?
		)
		SELECT
			COALESCE(ld.total_loans, 0),
			COALESCE(ld.total_remaining_loan, 0),
			COALESCE(ed.total_expenses, 0),
			COALESCE(td.total_income, 0),
			COALESCE(td.total_outcome, 0)
		FROM loan_data ld, trans_data td, expense_data ed;
		`

	var res domain.Dashboard

	row := r.db.QueryRowContext(ctx, query,
		userID, startDate, endDate, // loan_details
		userID, startDate, endDate, // transactions
		userID, // expenses
	)

	err := row.Scan(
		&res.TotalLoans,
		&res.TotalRemainingLoan,
		&res.TotalExpenses,
		&res.TotalIncome,
		&res.TotalOutcome,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return res, nil
		}
		return res, err
	}

	return res, nil
}

func (r *DashboardRepositoryImpl) GetMonthlySummary(ctx context.Context, userID int64, year int) (domain.MonthlySummary, error) {
	query := `
			WITH RECURSIVE months(m) AS (
			SELECT 1
			UNION ALL
			SELECT m + 1 FROM months WHERE m < 12
		)
		SELECT
			m AS month,

			COALESCE((
				SELECT CAST(SUM(ld.amount) AS SIGNED)
				FROM loan_details ld
				JOIN loans l ON l.id = ld.loan_id
				WHERE l.user_id = ?
				AND MONTH(ld.due_date) = m
				AND YEAR(ld.due_date) = ?
			), 0) AS monthly_loans,

			COALESCE((
				SELECT CAST(SUM(t.amount) AS SIGNED)
				FROM transactions t
				WHERE t.user_id = ? AND t.type='credit'
				AND MONTH(t.transaction_date) = m
				AND YEAR(t.transaction_date) = ?
			), 0) AS monthly_income,

			COALESCE((
				SELECT CAST(SUM(t.amount) AS SIGNED)
				FROM transactions t
				WHERE t.user_id = ? AND t.type='debit'
				AND MONTH(t.transaction_date) = m
				AND YEAR(t.transaction_date) = ?
			), 0) AS monthly_outcome

		FROM months
		ORDER BY m;
	`

	rows, err := r.db.QueryContext(ctx, query,
		userID, year, // loans
		userID, year, // income
		userID, year, // outcome
	)
	if err != nil {
		return domain.MonthlySummary{}, err
	}
	defer rows.Close()

	var summary domain.MonthlySummary
	summary.Loans = make([]int64, 12)
	summary.Income = make([]int64, 12)
	summary.Outcome = make([]int64, 12)

	for rows.Next() {
		var month int
		var loan, income, outcome int64

		if err := rows.Scan(&month, &loan, &income, &outcome); err != nil {
			return summary, err
		}

		idx := month - 1

		summary.Loans[idx] = loan
		summary.Income[idx] = income
		summary.Outcome[idx] = outcome
	}

	return summary, nil
}

func (r *DashboardRepositoryImpl) GetDailySummary(ctx context.Context, userID int64, startDate, endDate time.Time) (domain.DailySummary, error) {
	query := `
		WITH RECURSIVE dates AS (
			SELECT DATE(?) AS date
			UNION ALL
			SELECT DATE_ADD(date, INTERVAL 1 DAY)
			FROM dates
			WHERE date < DATE(?)
		)
		SELECT
			DATE_FORMAT(d.date, '%Y-%m-%d') AS label,
			COALESCE((
				SELECT CAST(SUM(t.amount) AS SIGNED)
				FROM transactions t
				WHERE t.user_id = ? AND t.type='credit'
				AND DATE(t.transaction_date) = d.date
			), 0) AS daily_income,
			COALESCE((
				SELECT CAST(SUM(t.amount) AS SIGNED)
				FROM transactions t
				WHERE t.user_id = ? AND t.type='debit'
				AND DATE(t.transaction_date) = d.date
			), 0) AS daily_outcome
		FROM dates d
		ORDER BY d.date;
	`

	rows, err := r.db.QueryContext(ctx, query,
		startDate, endDate,
		userID, // income
		userID, // outcome
	)
	if err != nil {
		return domain.DailySummary{}, err
	}
	defer rows.Close()

	var summary domain.DailySummary
	summary.Labels = []string{}
	summary.Income = []int64{}
	summary.Outcome = []int64{}

	for rows.Next() {
		var label string
		var income, outcome int64

		if err := rows.Scan(&label, &income, &outcome); err != nil {
			return summary, err
		}

		summary.Labels = append(summary.Labels, label)
		summary.Income = append(summary.Income, income)
		summary.Outcome = append(summary.Outcome, outcome)
	}

	return summary, nil
}

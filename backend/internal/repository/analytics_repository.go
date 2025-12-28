package repository

import (
	"context"
	"database/sql"
	"financial-health/internal/domain"
	"time"
)

type AnalyticsRepositoryImpl struct {
	db *sql.DB
}

func NewAnalyticsRepository(db *sql.DB) domain.AnalyticsRepository {
	return &AnalyticsRepositoryImpl{db}
}

func (r *AnalyticsRepositoryImpl) GetAnalyticsData(ctx context.Context, userID int64, startDate, endDate time.Time) (domain.AnalyticsData, error) {
	query := `
		WITH period_income AS (
			SELECT COALESCE(SUM(amount), 0) AS total
			FROM transactions
			WHERE user_id = ? AND type = 'credit'
			AND transaction_date BETWEEN ? AND ?
		),
		period_expenses AS (
			SELECT COALESCE(SUM(amount), 0) AS total
			FROM transactions
			WHERE user_id = ? AND type = 'debit'
			AND transaction_date BETWEEN ? AND ?
		),
		total_savings AS (
			SELECT COALESCE(SUM(amount), 0) AS total
			FROM transactions
			WHERE user_id = ? AND type = 'saving'
			AND transaction_date BETWEEN ? AND ?
		),
		total_debt AS (
			SELECT COALESCE(SUM(l.amount_due), 0) AS total
			FROM loans l
			WHERE l.user_id = ? AND l.status != 'completed'
		),
		period_debt_payment AS (
			SELECT COALESCE(SUM(ld.amount), 0) AS total
			FROM loan_details ld
			JOIN loans l ON l.id = ld.loan_id
			WHERE l.user_id = ?
			AND ld.due_date BETWEEN ? AND ?
		)
		SELECT
			pi.total AS period_income,
			pe.total AS period_expenses,
			ts.total AS total_savings,
			td.total AS total_debt,
			pdp.total AS period_debt_payment,
			pi.total AS monthly_income,
			pe.total AS monthly_expenses
		FROM period_income pi, period_expenses pe, total_savings ts, total_debt td, period_debt_payment pdp
	`

	var data domain.AnalyticsData
	row := r.db.QueryRowContext(ctx, query,
		userID, startDate, endDate, // period_income
		userID, startDate, endDate, // period_expenses
		userID, startDate, endDate, // total_savings (filtered by period)
		userID,                     // total_debt
		userID, startDate, endDate, // period_debt_payment
	)

	err := row.Scan(
		&data.TotalIncome,
		&data.TotalExpenses,
		&data.TotalSavings,
		&data.TotalDebt,
		&data.MonthlyDebtPayment,
		&data.MonthlyIncome,
		&data.MonthlyExpenses,
	)

	if err != nil && err != sql.ErrNoRows {
		return data, err
	}

	return data, nil
}

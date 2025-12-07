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

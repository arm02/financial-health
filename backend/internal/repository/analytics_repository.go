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

func (r *AnalyticsRepositoryImpl) GetAnalyticsData(ctx context.Context, userID int64) (domain.AnalyticsData, error) {
	now := time.Now()
	startOfYear := time.Date(now.Year(), 1, 1, 0, 0, 0, 0, now.Location())
	endOfYear := time.Date(now.Year(), 12, 31, 23, 59, 59, 0, now.Location())
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	endOfMonth := startOfMonth.AddDate(0, 1, 0).Add(-time.Second)

	query := `
		WITH yearly_income AS (
			SELECT COALESCE(SUM(amount), 0) AS total
			FROM transactions
			WHERE user_id = ? AND type = 'credit'
			AND transaction_date BETWEEN ? AND ?
		),
		yearly_expenses AS (
			SELECT COALESCE(SUM(amount), 0) AS total
			FROM transactions
			WHERE user_id = ? AND type = 'debit'
			AND transaction_date BETWEEN ? AND ?
		),
		total_savings AS (
			SELECT COALESCE(SUM(amount), 0) AS total
			FROM transactions
			WHERE user_id = ? AND type = 'saving'
		),
		total_debt AS (
			SELECT COALESCE(SUM(l.amount_due), 0) AS total
			FROM loans l
			WHERE l.user_id = ? AND l.status != 'completed'
		),
		monthly_debt_payment AS (
			SELECT COALESCE(SUM(ld.amount), 0) AS total
			FROM loan_details ld
			JOIN loans l ON l.id = ld.loan_id
			WHERE l.user_id = ?
			AND ld.due_date BETWEEN ? AND ?
		),
		monthly_income AS (
			SELECT COALESCE(SUM(amount), 0) AS total
			FROM transactions
			WHERE user_id = ? AND type = 'credit'
			AND transaction_date BETWEEN ? AND ?
		),
		monthly_expenses AS (
			SELECT COALESCE(SUM(amount), 0) AS total
			FROM transactions
			WHERE user_id = ? AND type = 'debit'
			AND transaction_date BETWEEN ? AND ?
		)
		SELECT
			yi.total AS yearly_income,
			ye.total AS yearly_expenses,
			ts.total AS total_savings,
			td.total AS total_debt,
			mdp.total AS monthly_debt_payment,
			mi.total AS monthly_income,
			me.total AS monthly_expenses
		FROM yearly_income yi, yearly_expenses ye, total_savings ts, total_debt td,
			 monthly_debt_payment mdp, monthly_income mi, monthly_expenses me
	`

	var data domain.AnalyticsData
	row := r.db.QueryRowContext(ctx, query,
		userID, startOfYear, endOfYear, // yearly_income
		userID, startOfYear, endOfYear, // yearly_expenses
		userID,                         // total_savings
		userID,                         // total_debt
		userID, startOfMonth, endOfMonth, // monthly_debt_payment
		userID, startOfMonth, endOfMonth, // monthly_income
		userID, startOfMonth, endOfMonth, // monthly_expenses
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

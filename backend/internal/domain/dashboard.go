package domain

import (
	"context"
	"time"
)

type Dashboard struct {
	TotalLoans         float64 `json:"total_loans"`
	TotalRemainingLoan float64 `json:"total_remaining_loan"`
	TotalExpenses      float64 `json:"total_expenses"`
	TotalIncome        float64 `json:"total_income"`
	TotalOutcome       float64 `json:"total_outcome"`
}

type MonthlySummary struct {
	Loans   []int64 `json:"loans"`
	Income  []int64 `json:"income"`
	Outcome []int64 `json:"outcome"`
}

type DailySummary struct {
	Labels  []string `json:"labels"`
	Income  []int64  `json:"income"`
	Outcome []int64  `json:"outcome"`
}

type DashboardUseCase interface {
	GetDashboardSummary(ctx context.Context, userID int64, startDate, endDate time.Time) (Dashboard, error)
	GetChartSummary(ctx context.Context, userID int64, year int) (MonthlySummary, error)
	GetDailyChartSummary(ctx context.Context, userID int64, startDate, endDate time.Time) (DailySummary, error)
}

type DashboardRepository interface {
	GetTotalsByDateRange(ctx context.Context, userID int64, startDate, endDate time.Time) (Dashboard, error)
	GetMonthlySummary(ctx context.Context, userID int64, year int) (MonthlySummary, error)
	GetDailySummary(ctx context.Context, userID int64, startDate, endDate time.Time) (DailySummary, error)
}

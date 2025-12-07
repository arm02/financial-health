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

type DashboardUseCase interface {
	GetDashboardSummary(ctx context.Context, userID int64, startDate, endDate time.Time) (Dashboard, error)
}

type DashboardRepository interface {
	GetTotalsByDateRange(ctx context.Context, userID int64, startDate, endDate time.Time) (Dashboard, error)
}

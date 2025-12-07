package usecase

import (
	"context"
	"financial-health/internal/domain"
	"time"
)

type DashboardUseCase struct {
	dashboardRepo domain.DashboardRepository
}

func NewDashboardUseCase(dashboardRepo domain.DashboardRepository) domain.DashboardUseCase {
	return &DashboardUseCase{
		dashboardRepo: dashboardRepo,
	}
}

func (u *DashboardUseCase) GetDashboardSummary(ctx context.Context, userID int64, startDate, endDate time.Time) (domain.Dashboard, error) {
	return u.dashboardRepo.GetTotalsByDateRange(ctx, userID, startDate, endDate)
}

func (u *DashboardUseCase) GetChartSummary(ctx context.Context, userID int64, year int) (domain.MonthlySummary, error) {
	return u.dashboardRepo.GetMonthlySummary(ctx, userID, year)
}

package domain

import (
	"context"
	"time"
)

type FinancialHealthScore struct {
	OverallScore         float64                `json:"overall_score"`
	OverallStatus        string                 `json:"overall_status"`
	EmergencyFundRatio   FinancialMetric        `json:"emergency_fund_ratio"`
	DebtServiceRatio     FinancialMetric        `json:"debt_service_ratio"`
	SavingsRatio         FinancialMetric        `json:"savings_ratio"`
	LiquidityRatio       FinancialMetric        `json:"liquidity_ratio"`
	DebtToIncomeRatio    FinancialMetric        `json:"debt_to_income_ratio"`
	Recommendations      []string               `json:"recommendations"`
	FinancialSummary     FinancialSummary       `json:"financial_summary"`
}

type FinancialMetric struct {
	Value       float64 `json:"value"`
	Score       float64 `json:"score"`
	Status      string  `json:"status"`
	Description string  `json:"description"`
}

type FinancialSummary struct {
	TotalIncome         float64 `json:"total_income"`
	TotalExpenses       float64 `json:"total_expenses"`
	TotalSavings        float64 `json:"total_savings"`
	TotalDebt           float64 `json:"total_debt"`
	MonthlyDebtPayment  float64 `json:"monthly_debt_payment"`
	EmergencyFund       float64 `json:"emergency_fund"`
	MonthlyExpenses     float64 `json:"monthly_expenses"`
}

type AnalyticsData struct {
	TotalIncome        float64
	TotalExpenses      float64
	TotalSavings       float64
	TotalDebt          float64
	MonthlyDebtPayment float64
	MonthlyIncome      float64
	MonthlyExpenses    float64
}

type AnalyticsUseCase interface {
	GetFinancialHealth(ctx context.Context, userID int64, startDate, endDate time.Time) (FinancialHealthScore, error)
}

type AnalyticsRepository interface {
	GetAnalyticsData(ctx context.Context, userID int64, startDate, endDate time.Time) (AnalyticsData, error)
}

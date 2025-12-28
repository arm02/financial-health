package usecase

import (
	"context"
	"financial-health/internal/domain"
	"math"
	"time"
)

type AnalyticsUseCase struct {
	analyticsRepo domain.AnalyticsRepository
}

func NewAnalyticsUseCase(analyticsRepo domain.AnalyticsRepository) domain.AnalyticsUseCase {
	return &AnalyticsUseCase{
		analyticsRepo: analyticsRepo,
	}
}

func (u *AnalyticsUseCase) GetFinancialHealth(ctx context.Context, userID int64, startDate, endDate time.Time) (domain.FinancialHealthScore, error) {
	data, err := u.analyticsRepo.GetAnalyticsData(ctx, userID, startDate, endDate)
	if err != nil {
		return domain.FinancialHealthScore{}, err
	}

	result := domain.FinancialHealthScore{
		FinancialSummary: domain.FinancialSummary{
			TotalIncome:        data.TotalIncome,
			TotalExpenses:      data.TotalExpenses,
			TotalSavings:       data.TotalSavings,
			TotalDebt:          data.TotalDebt,
			MonthlyDebtPayment: data.MonthlyDebtPayment,
			EmergencyFund:      data.TotalSavings,
			MonthlyExpenses:    data.MonthlyExpenses,
		},
	}

	result.EmergencyFundRatio = u.calculateEmergencyFundRatio(data)
	result.DebtServiceRatio = u.calculateDebtServiceRatio(data)
	result.SavingsRatio = u.calculateSavingsRatio(data)
	result.LiquidityRatio = u.calculateLiquidityRatio(data)
	result.DebtToIncomeRatio = u.calculateDebtToIncomeRatio(data)

	totalScore := (result.EmergencyFundRatio.Score +
		result.DebtServiceRatio.Score +
		result.SavingsRatio.Score +
		result.LiquidityRatio.Score +
		result.DebtToIncomeRatio.Score) / 5

	result.OverallScore = math.Round(totalScore*100) / 100
	result.OverallStatus = u.getOverallStatus(result.OverallScore)
	result.Recommendations = u.generateRecommendations(result)

	return result, nil
}

func (u *AnalyticsUseCase) calculateEmergencyFundRatio(data domain.AnalyticsData) domain.FinancialMetric {
	var ratio float64
	if data.MonthlyExpenses > 0 {
		ratio = data.TotalSavings / data.MonthlyExpenses
	}

	var score float64
	var status string

	switch {
	case ratio >= 6:
		score = 100
		status = "Excellent"
	case ratio >= 3:
		score = 75
		status = "Good"
	case ratio >= 1:
		score = 50
		status = "Fair"
	default:
		score = 25
		status = "Poor"
	}

	return domain.FinancialMetric{
		Value:       math.Round(ratio*100) / 100,
		Score:       score,
		Status:      status,
		Description: "Months of expenses covered by savings",
	}
}

func (u *AnalyticsUseCase) calculateDebtServiceRatio(data domain.AnalyticsData) domain.FinancialMetric {
	var ratio float64
	if data.MonthlyIncome > 0 {
		ratio = (data.MonthlyDebtPayment / data.MonthlyIncome) * 100
	}

	var score float64
	var status string

	switch {
	case ratio <= 20:
		score = 100
		status = "Excellent"
	case ratio <= 35:
		score = 75
		status = "Good"
	case ratio <= 50:
		score = 50
		status = "Fair"
	default:
		score = 25
		status = "Poor"
	}

	return domain.FinancialMetric{
		Value:       math.Round(ratio*100) / 100,
		Score:       score,
		Status:      status,
		Description: "Percentage of income used for debt payments",
	}
}

func (u *AnalyticsUseCase) calculateSavingsRatio(data domain.AnalyticsData) domain.FinancialMetric {
	var ratio float64
	if data.MonthlyIncome > 0 {
		monthlySavings := data.MonthlyIncome - data.MonthlyExpenses - data.MonthlyDebtPayment
		if monthlySavings > 0 {
			ratio = (monthlySavings / data.MonthlyIncome) * 100
		}
	}

	var score float64
	var status string

	switch {
	case ratio >= 20:
		score = 100
		status = "Excellent"
	case ratio >= 10:
		score = 75
		status = "Good"
	case ratio >= 5:
		score = 50
		status = "Fair"
	default:
		score = 25
		status = "Poor"
	}

	return domain.FinancialMetric{
		Value:       math.Round(ratio*100) / 100,
		Score:       score,
		Status:      status,
		Description: "Percentage of income saved monthly",
	}
}

func (u *AnalyticsUseCase) calculateLiquidityRatio(data domain.AnalyticsData) domain.FinancialMetric {
	var ratio float64
	if data.MonthlyDebtPayment > 0 {
		ratio = data.TotalSavings / data.MonthlyDebtPayment
	} else if data.TotalSavings > 0 {
		ratio = 10
	}

	var score float64
	var status string

	switch {
	case ratio >= 3:
		score = 100
		status = "Excellent"
	case ratio >= 2:
		score = 75
		status = "Good"
	case ratio >= 1:
		score = 50
		status = "Fair"
	default:
		score = 25
		status = "Poor"
	}

	return domain.FinancialMetric{
		Value:       math.Round(ratio*100) / 100,
		Score:       score,
		Status:      status,
		Description: "Ability to cover debt payments with savings",
	}
}

func (u *AnalyticsUseCase) calculateDebtToIncomeRatio(data domain.AnalyticsData) domain.FinancialMetric {
	var ratio float64
	if data.TotalIncome > 0 {
		ratio = (data.TotalDebt / data.TotalIncome) * 100
	}

	var score float64
	var status string

	switch {
	case ratio <= 15:
		score = 100
		status = "Excellent"
	case ratio <= 35:
		score = 75
		status = "Good"
	case ratio <= 50:
		score = 50
		status = "Fair"
	default:
		score = 25
		status = "Poor"
	}

	return domain.FinancialMetric{
		Value:       math.Round(ratio*100) / 100,
		Score:       score,
		Status:      status,
		Description: "Total debt relative to annual income",
	}
}

func (u *AnalyticsUseCase) getOverallStatus(score float64) string {
	switch {
	case score >= 80:
		return "Excellent"
	case score >= 60:
		return "Good"
	case score >= 40:
		return "Fair"
	default:
		return "Poor"
	}
}

func (u *AnalyticsUseCase) generateRecommendations(result domain.FinancialHealthScore) []string {
	var recommendations []string

	if result.EmergencyFundRatio.Status == "Poor" || result.EmergencyFundRatio.Status == "Fair" {
		recommendations = append(recommendations, "Build your emergency fund to cover at least 3-6 months of expenses")
	}

	if result.DebtServiceRatio.Status == "Poor" || result.DebtServiceRatio.Status == "Fair" {
		recommendations = append(recommendations, "Consider reducing debt payments or increasing income to lower your debt service ratio")
	}

	if result.SavingsRatio.Status == "Poor" || result.SavingsRatio.Status == "Fair" {
		recommendations = append(recommendations, "Try to save at least 10-20% of your monthly income")
	}

	if result.LiquidityRatio.Status == "Poor" || result.LiquidityRatio.Status == "Fair" {
		recommendations = append(recommendations, "Increase liquid savings to better handle unexpected debt obligations")
	}

	if result.DebtToIncomeRatio.Status == "Poor" || result.DebtToIncomeRatio.Status == "Fair" {
		recommendations = append(recommendations, "Focus on paying down debt to improve your debt-to-income ratio")
	}

	if len(recommendations) == 0 {
		recommendations = append(recommendations, "Great job! Keep maintaining your healthy financial habits")
	}

	return recommendations
}

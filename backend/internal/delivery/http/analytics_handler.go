package http

import (
	"financial-health/internal/domain"
	"financial-health/internal/utils"
	"time"

	"github.com/gin-gonic/gin"
)

type AnalyticsHandler struct {
	AnalyticsUseCase domain.AnalyticsUseCase
}

func NewAnalyticsHandler(us domain.AnalyticsUseCase) *AnalyticsHandler {
	return &AnalyticsHandler{AnalyticsUseCase: us}
}

func (h *AnalyticsHandler) GetFinancialHealth(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))

	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")

	var startDate, endDate time.Time
	var err error

	if startDateStr == "" || endDateStr == "" {
		// Default to current month
		now := time.Now()
		startDate = time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
		endDate = startDate.AddDate(0, 1, 0).Add(-time.Second)
	} else {
		startDate, err = time.Parse("2006-01-02", startDateStr)
		if err != nil {
			utils.ErrorResponse(c, utils.NewBusinessError("invalid start_date format, use YYYY-MM-DD", nil))
			return
		}

		endDate, err = time.Parse("2006-01-02", endDateStr)
		if err != nil {
			utils.ErrorResponse(c, utils.NewBusinessError("invalid end_date format, use YYYY-MM-DD", nil))
			return
		}
		endDate = endDate.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
	}

	healthScore, err := h.AnalyticsUseCase.GetFinancialHealth(c, userID, startDate, endDate)
	if err != nil {
		utils.ErrorResponse(c, utils.NewBusinessError("failed to fetch financial health", err))
		return
	}

	utils.SuccessResponse(c, healthScore, "Financial health fetched successfully")
}

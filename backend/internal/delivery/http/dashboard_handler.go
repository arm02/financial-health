package http

import (
	"financial-health/internal/domain"
	"financial-health/internal/utils"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type DashboardHandler struct {
	DashboardUseCase domain.DashboardUseCase
}

func NewDashboardnHandler(us domain.DashboardUseCase) *DashboardHandler {
	return &DashboardHandler{DashboardUseCase: us}
}

func (h *DashboardHandler) GetSummary(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")

	if startDateStr == "" || endDateStr == "" {
		utils.ErrorResponse(c, utils.NewBusinessError("start_date and end_date are required (format: 2025-01-01)", nil))
		return
	}

	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		utils.ErrorResponse(c, utils.NewBusinessError("invalid start_date format, use YYYY-MM-DD", nil))
		return
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		utils.ErrorResponse(c, utils.NewBusinessError("invalid end_date format, use YYYY-MM-DD", nil))
		return
	}

	endDate = endDate.Add(23*time.Hour + 59*time.Minute + 59*time.Second)

	summary, err := h.DashboardUseCase.GetDashboardSummary(c, userID, startDate, endDate)
	if err != nil {
		utils.ErrorResponse(c, utils.NewBusinessError("failed to fetch summary", err))
		return
	}

	utils.SuccessResponse(c, summary, "Summary fetched successfully")
}

func (h *DashboardHandler) GetChartSummary(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))

	yearStr := c.Query("year")

	var year int
	var err error
	if yearStr == "" {
		year = time.Now().Year()
	} else {
		year, err = strconv.Atoi(yearStr)
		if err != nil {
			utils.ErrorResponse(c, utils.NewBusinessError("invalid year format, example: 2025", err))
			return
		}
	}

	summary, err := h.DashboardUseCase.GetChartSummary(c, userID, year)
	if err != nil {
		utils.ErrorResponse(c, utils.NewBusinessError("failed to fetch summary", err))
		return
	}

	utils.SuccessResponse(c, summary, "Summary fetched successfully")
}

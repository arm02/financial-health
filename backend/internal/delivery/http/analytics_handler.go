package http

import (
	"financial-health/internal/domain"
	"financial-health/internal/utils"

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

	healthScore, err := h.AnalyticsUseCase.GetFinancialHealth(c, userID)
	if err != nil {
		utils.ErrorResponse(c, utils.NewBusinessError("failed to fetch financial health", err))
		return
	}

	utils.SuccessResponse(c, healthScore, "Financial health fetched successfully")
}

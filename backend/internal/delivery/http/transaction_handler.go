package http

import (
	"financial-health/internal/constants"
	"financial-health/internal/domain"
	"financial-health/internal/utils"

	"github.com/gin-gonic/gin"
)

type TransactionHandler struct {
	TrxUsecase domain.TransactionUseCase
}

func NewTransactionHandler(us domain.TransactionUseCase) *TransactionHandler {
	return &TransactionHandler{TrxUsecase: us}
}

func (h *TransactionHandler) Create(c *gin.Context) {
	var input struct {
		Title       string  `json:"title" binding:"required"`
		Type        string  `json:"type" binding:"required"`
		ReferenceID int64   `json:"reference_id"`
		Amount      float64 `json:"amount" binding:"gte=0"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError("Invalid request body", err))
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))

	trx := &domain.Transaction{
		UserID:      userID,
		Title:       input.Title,
		Type:        input.Type,
		ReferenceID: input.ReferenceID,
		Amount:      input.Amount,
	}

	if err := h.TrxUsecase.CreateTransaction(c.Request.Context(), trx); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError(err.Error(), err))
		return
	}

	utils.SuccessResponse(c, trx, constants.TRANSACTION_CREATED)
}

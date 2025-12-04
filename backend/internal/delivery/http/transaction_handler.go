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
		Title       string  `json:"title"`
		Type        string  `json:"type" binding:"required"`
		ReferenceID int64   `json:"reference_id"`
		Amount      float64 `json:"amount"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError("Invalid request body", err))
		return
	}

	trx := &domain.Transaction{
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

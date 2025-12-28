package http

import (
	"financial-health/internal/constants"
	"financial-health/internal/domain"
	"financial-health/internal/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type TransactionHandler struct {
	TrxUsecase domain.TransactionUseCase
}

func NewTransactionHandler(us domain.TransactionUseCase) *TransactionHandler {
	return &TransactionHandler{TrxUsecase: us}
}

func (h *TransactionHandler) CreateTransaction(c *gin.Context) {
	var input struct {
		Title           string  `json:"title" binding:"required"`
		Type            string  `json:"type" binding:"required"`
		ReferenceID     int64   `json:"reference_id"`
		Amount          float64 `json:"amount" binding:"gte=0"`
		TransactionDate string  `json:"transaction_date"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError("Invalid request body", err))
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))

	trx := &domain.Transaction{
		UserID:          userID,
		Title:           input.Title,
		Type:            input.Type,
		ReferenceID:     input.ReferenceID,
		Amount:          input.Amount,
		TransactionDate: input.TransactionDate,
	}

	if err := h.TrxUsecase.CreateTransaction(c.Request.Context(), trx); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError(err.Error(), err))
		return
	}

	utils.SuccessResponse(c, trx, constants.TRANSACTION_CREATED)
}

func (h *TransactionHandler) GetAllTransaction(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	sortBy := c.DefaultQuery("sort_by", "created_at")
	sortType := c.DefaultQuery("sort_type", "DESC")
	query := c.DefaultQuery("query", "")
	tipe := c.DefaultQuery("tipe", "")
	startDate := c.DefaultQuery("start_date", "")
	endDate := c.DefaultQuery("end_date", "")

	result, err := h.TrxUsecase.GetAllTransaction(c.Request.Context(), userID, page, limit, sortBy, sortType, query, tipe, startDate, endDate)
	if err != nil {
		utils.ErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, result, "Transactions fetched successfully")
}

func (h *TransactionHandler) DeleteTransaction(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))
	trxIDStr := c.Param("id")
	trxID, _ := strconv.ParseInt(trxIDStr, 10, 64)

	_, err := h.TrxUsecase.DeleteTransaction(c.Request.Context(), userID, trxID)
	if err != nil {
		utils.ErrorResponse(c, utils.NewBusinessError(err.Error(), err))
		return
	}
	utils.SuccessResponse(c, nil, "Transactions deleted")
}

func (h *TransactionHandler) UpdateTransaction(c *gin.Context) {
	var input struct {
		Title           string  `json:"title" binding:"required"`
		Type            string  `json:"type" binding:"required"`
		Amount          float64 `json:"amount" binding:"gte=0"`
		TransactionDate string  `json:"transaction_date"`
	}

	trxIDStr := c.Param("id")
	trxID, _ := strconv.ParseInt(trxIDStr, 10, 64)

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError("Invalid request body", err))
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))

	trx := &domain.Transaction{
		ID:              trxID,
		UserID:          userID,
		Title:           input.Title,
		Type:            input.Type,
		Amount:          input.Amount,
		TransactionDate: input.TransactionDate,
	}

	if err := h.TrxUsecase.UpdateTransaction(c.Request.Context(), trx); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError(err.Error(), err))
		return
	}

	utils.SuccessResponse(c, trx, constants.TRANSACTION_UPDATED)
}

package http

import (
	"financial-health/internal/constants"
	"financial-health/internal/domain"
	"financial-health/internal/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ExpensesHandler struct {
	ExpUsecase domain.ExpensesUseCase
}

func NewExpensesHandler(us domain.ExpensesUseCase) *ExpensesHandler {
	return &ExpensesHandler{ExpUsecase: us}
}

func (h *ExpensesHandler) CreateExpenses(c *gin.Context) {
	var input struct {
		Title  string  `json:"title" binding:"required"`
		Type   string  `json:"type" binding:"required"`
		Amount float64 `json:"amount" binding:"gte=0"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError("Invalid request body", err))
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))

	exp := &domain.Expenses{
		UserID: userID,
		Title:  input.Title,
		Type:   input.Type,
		Amount: input.Amount,
	}

	if err := h.ExpUsecase.CreateExpenses(c.Request.Context(), exp); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError(err.Error(), err))
		return
	}

	utils.SuccessResponse(c, exp, constants.EXPENSES_CREATED)
}

func (h *ExpensesHandler) GetAllExpenses(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	sortBy := c.DefaultQuery("sort_by", "created_at")
	sortType := c.DefaultQuery("sort_type", "DESC")
	query := c.DefaultQuery("query", "")
	startDate := c.DefaultQuery("start_date", "")
	endDate := c.DefaultQuery("end_date", "")

	result, err := h.ExpUsecase.GetAllExpenses(c.Request.Context(), userID, page, limit, sortBy, sortType, query, startDate, endDate)
	if err != nil {
		utils.ErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, result, constants.EXPENSES_GET_ALL_SUCCESS)
}

func (h *ExpensesHandler) GetDetailExpenses(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))
	expIDStr := c.Param("id")
	expID, _ := strconv.ParseInt(expIDStr, 10, 64)

	result, err := h.ExpUsecase.GetDetailExpenses(c.Request.Context(), userID, expID)
	if err != nil {
		utils.ErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, result, constants.EXPENSES_GET_ALL_SUCCESS)
}

func (h *ExpensesHandler) DeleteExpenses(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))
	expIDStr := c.Param("id")
	expID, _ := strconv.ParseInt(expIDStr, 10, 64)

	_, err := h.ExpUsecase.DeleteExpenses(c.Request.Context(), userID, expID)
	if err != nil {
		utils.ErrorResponse(c, utils.NewBusinessError(err.Error(), err))
		return
	}
	utils.SuccessResponse(c, nil, constants.EXPENSES_DELETED)
}

func (h *ExpensesHandler) UpdateExpenses(c *gin.Context) {
	var input struct {
		Title  string  `json:"title" binding:"required"`
		Type   string  `json:"type" binding:"required"`
		Amount float64 `json:"amount" binding:"gte=0"`
	}

	expIDStr := c.Param("id")
	expID, _ := strconv.ParseInt(expIDStr, 10, 64)

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError(constants.INVALID_REQUEST_BODY, err))
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))

	exp := &domain.Expenses{
		ID:     expID,
		UserID: userID,
		Title:  input.Title,
		Type:   input.Type,
		Amount: input.Amount,
	}

	if err := h.ExpUsecase.UpdateExpenses(c.Request.Context(), exp); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError(err.Error(), err))
		return
	}

	utils.SuccessResponse(c, exp, constants.EXPENSES_UPDATED)
}

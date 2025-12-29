package http

import (
	"financial-health/internal/domain"
	"financial-health/internal/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type TodoHandler struct {
	TodoUseCase domain.TodoUseCase
}

func NewTodoHandler(us domain.TodoUseCase) *TodoHandler {
	return &TodoHandler{TodoUseCase: us}
}

func (h *TodoHandler) Create(c *gin.Context) {
	var input struct {
		Title       string  `json:"title" binding:"required"`
		Description string  `json:"description"`
		Priority    string  `json:"priority"`
		Status      string  `json:"status"`
		DueDate     *string `json:"due_date"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError("Invalid request body", err))
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))

	todo := &domain.Todo{
		UserID:      userID,
		Title:       input.Title,
		Description: input.Description,
		Priority:    input.Priority,
		Status:      input.Status,
		DueDate:     input.DueDate,
	}

	if err := h.TodoUseCase.Create(c.Request.Context(), todo); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError(err.Error(), err))
		return
	}

	utils.SuccessResponse(c, todo, "Todo created successfully")
}

func (h *TodoHandler) GetAll(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	sortBy := c.DefaultQuery("sort_by", "created_at")
	sortType := c.DefaultQuery("sort_type", "DESC")
	query := c.DefaultQuery("query", "")
	status := c.DefaultQuery("status", "")
	priority := c.DefaultQuery("priority", "")

	result, err := h.TodoUseCase.GetAll(c.Request.Context(), userID, page, limit, sortBy, sortType, query, status, priority)
	if err != nil {
		utils.ErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, result, "Todos fetched successfully")
}

func (h *TodoHandler) GetByID(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))
	todoIDStr := c.Param("id")
	todoID, _ := strconv.ParseInt(todoIDStr, 10, 64)

	result, err := h.TodoUseCase.GetByID(c.Request.Context(), userID, todoID)
	if err != nil {
		utils.ErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, result, "Todo fetched successfully")
}

func (h *TodoHandler) Update(c *gin.Context) {
	var input struct {
		Title       string  `json:"title" binding:"required"`
		Description string  `json:"description"`
		Priority    string  `json:"priority"`
		Status      string  `json:"status"`
		DueDate     *string `json:"due_date"`
	}

	todoIDStr := c.Param("id")
	todoID, _ := strconv.ParseInt(todoIDStr, 10, 64)

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError("Invalid request body", err))
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))

	todo := &domain.Todo{
		ID:          todoID,
		UserID:      userID,
		Title:       input.Title,
		Description: input.Description,
		Priority:    input.Priority,
		Status:      input.Status,
		DueDate:     input.DueDate,
	}

	if err := h.TodoUseCase.Update(c.Request.Context(), todo); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError(err.Error(), err))
		return
	}

	utils.SuccessResponse(c, todo, "Todo updated successfully")
}

func (h *TodoHandler) Delete(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))
	todoIDStr := c.Param("id")
	todoID, _ := strconv.ParseInt(todoIDStr, 10, 64)

	if err := h.TodoUseCase.Delete(c.Request.Context(), userID, todoID); err != nil {
		utils.ErrorResponse(c, utils.NewBusinessError(err.Error(), err))
		return
	}

	utils.SuccessResponse(c, nil, "Todo deleted successfully")
}

func (h *TodoHandler) ToggleStatus(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))
	todoIDStr := c.Param("id")
	todoID, _ := strconv.ParseInt(todoIDStr, 10, 64)

	result, err := h.TodoUseCase.ToggleStatus(c.Request.Context(), userID, todoID)
	if err != nil {
		utils.ErrorResponse(c, utils.NewBusinessError(err.Error(), err))
		return
	}

	utils.SuccessResponse(c, result, "Todo status toggled successfully")
}

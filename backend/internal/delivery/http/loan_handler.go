package http

import (
	"financial-health/internal/constants"
	"financial-health/internal/domain"
	"financial-health/internal/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type LoanHandler struct {
	LoanUseCase domain.LoanUseCase
}

func NewLoanHandler(us domain.LoanUseCase) *LoanHandler {
	return &LoanHandler{
		LoanUseCase: us,
	}
}

func (h *LoanHandler) CreateLoan(c *gin.Context) {
	var input struct {
		Title     string  `json:"title"`
		Tenor     int     `json:"tenor"`
		TenorType string  `json:"tenor_type"`
		Amount    float64 `json:"amount"`
		StartDate string  `json:"start_date"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError("Invalid request body", err))
		return
	}

	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))

	loan := &domain.Loan{
		UserID:    userID,
		Title:     input.Title,
		Tenor:     input.Tenor,
		TenorType: input.TenorType,
		Amount:    input.Amount,
		StartDate: input.StartDate,
	}

	if err := h.LoanUseCase.CreateLoan(c.Request.Context(), loan); err != nil {
		utils.ErrorResponse(c, utils.NewSystemError(err.Error(), err))
		return
	}
	utils.SuccessResponse(c, loan, constants.LOAN_SUCCESS_CREATED)
}

func (h *LoanHandler) GetAllLoans(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int64(userIDVal.(float64))

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	sortBy := c.DefaultQuery("sort_by", "created_at")
	sortType := c.DefaultQuery("sort_type", "DESC")
	query := c.DefaultQuery("query", "")

	result, err := h.LoanUseCase.GetAllLoans(c.Request.Context(), userID, page, limit, sortBy, sortType, query)
	if err != nil {
		utils.ErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, result, "Loans fetched successfully")
}

func (h *LoanHandler) GetLoan(c *gin.Context) {
	loanIDStr := c.Param("id")
	loanID, _ := strconv.ParseInt(loanIDStr, 10, 64)

	loanDetail, err := h.LoanUseCase.GetLoan(c.Request.Context(), loanID)
	if err != nil {
		utils.ErrorResponse(c, utils.NewSystemError(err.Error(), err))
		return
	}
	utils.SuccessResponse(c, loanDetail, constants.SUCCESS)
}

func (h *LoanHandler) GetDetails(c *gin.Context) {
	loanIDStr := c.Param("id")
	loanID, _ := strconv.ParseInt(loanIDStr, 10, 64)

	details, err := h.LoanUseCase.GetLoanDetails(c.Request.Context(), loanID)
	if err != nil {
		utils.ErrorResponse(c, utils.NewSystemError(err.Error(), err))
		return
	}
	utils.SuccessResponse(c, details, constants.SUCCESS)
}

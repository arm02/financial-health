package http

import (
	"financial-health/internal/constants"
	"financial-health/internal/domain"
	"financial-health/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	UserUsecase domain.UserUseCase
}

func NewUserHandler(us domain.UserUseCase) *UserHandler {
	return &UserHandler{
		UserUsecase: us,
	}
}

func (h *UserHandler) Register(c *gin.Context) {
	var input struct {
		Fullname string `json:"fullname" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError("Invalid request body", err))
		return
	}

	if err := h.UserUsecase.Register(c.Request.Context(), input.Fullname, input.Email, input.Password); err != nil {
		utils.ErrorResponse(c, utils.NewSystemError(err.Error(), err))
		return
	}
	utils.SuccessResponse(c, input, constants.USER_SUCESSS_REGISTERED)
}

func (h *UserHandler) Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, utils.NewValidationError("Invalid request body", err))
		return
	}

	user, err := h.UserUsecase.Login(c.Request.Context(), input.Email, input.Password)
	if err != nil {
		utils.ErrorResponse(c, utils.NewAuthError(err.Error(), err))
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "auth_token",
		Value:    user.Token,
		Path:     "/",
		Domain:   "financial.adrianmilano.my.id",
		MaxAge:   3600,
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	})
	utils.SuccessResponse(c, user, constants.USER_SUCCESS_LOGIN)
}

func (h *UserHandler) Logout(c *gin.Context) {
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",
		Domain:   "financial.adrianmilano.my.id",
		MaxAge:   -1,
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	})

	utils.SuccessResponse(c, nil, "Logout successful")
}

func (h *UserHandler) Profile(c *gin.Context) {
	userIDVal, exists := c.Get("user_id")
	if !exists {
		utils.ErrorResponse(c, utils.NewAuthError("User ID not found in context", nil))
		return
	}

	var id int64
	switch v := userIDVal.(type) {
	case float64:
		id = int64(v)
	case int64:
		id = v
	default:
		utils.ErrorResponse(c, utils.NewSystemError("Type assertion failed", nil))
		return
	}

	user, err := h.UserUsecase.GetByID(c.Request.Context(), id)
	if err != nil {
		utils.ErrorResponse(c, utils.NewBusinessError("User not found", nil))
		return
	}

	utils.SuccessResponse(c, user, constants.SUCCESS)
}

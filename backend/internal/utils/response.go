package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ResponseSuccess struct {
	Code    int         `json:"code"`
	Status  bool        `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func SuccessResponse(c *gin.Context, data interface{}, message string) {
	c.JSON(http.StatusOK, ResponseSuccess{
		Code:    http.StatusOK,
		Status:  true,
		Message: message,
		Data:    data,
	})
}

func ErrorResponse(c *gin.Context, err error) {
	code := http.StatusInternalServerError
	errorType := SystemError
	message := "Internal server error"
	errorDetail := err.Error()

	if appErr, ok := IsAppError(err); ok {
		errorType = appErr.Type
		message = appErr.Message
		errorDetail = appErr.Error()

		switch appErr.Type {
		case ValidationError:
			code = http.StatusBadRequest
		case BusinessError:
			code = http.StatusUnprocessableEntity
		case SystemError:
			code = http.StatusInternalServerError
		case AuthError:
			code = http.StatusUnauthorized
		}
	}

	c.JSON(code, &ResponseError{
		Code:      code,
		Status:    false,
		Type:      errorType,
		Message:   message,
		Error:     errorDetail,
		ErrorCode: ErrorCode[errorType],
	})
}

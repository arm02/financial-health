package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func SuccessResponse(c *gin.Context, data interface{}, message string) {
	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"status":  "success",
		"message": message,
		"error":   nil,
		"data":    data,
	})
}

func SuccessResponseList(c *gin.Context, data interface{}, message string) {
	c.JSON(http.StatusOK, gin.H{
		"code":    http.StatusOK,
		"status":  "success",
		"message": message,
		"error":   nil,
		"data":    data,
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
		Status:    "error",
		Type:      errorType,
		Message:   message,
		Error:     errorDetail,
		ErrorCode: ErrorCode[errorType],
		Data:      nil,
	})
}

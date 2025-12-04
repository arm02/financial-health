package middleware

import (
	"financial-health/internal/utils"
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func Recovery(logger *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if rec := recover(); rec != nil {
				logger.Error("panic recovered",
					zap.Any("error", rec),
					zap.ByteString("stack", debug.Stack()),
				)

				utils.ErrorResponse(c, utils.NewSystemError("Internal server error", nil))
				c.AbortWithStatus(http.StatusInternalServerError)
			}
		}()
		c.Next()
	}
}

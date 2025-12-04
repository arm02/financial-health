package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func AuditMiddleware(logger *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		c.Next()

		requestID, _ := c.Get("request_id")
		userID, _ := c.Get("user_id")
		email, _ := c.Get("email")

		logger.Info("audit_log",
			zap.String("request_id", requestID.(string)),
			zap.Any("user_id", userID),
			zap.Any("email", email),
			zap.String("method", c.Request.Method),
			zap.String("path", c.Request.URL.Path),
			zap.Int("status", c.Writer.Status()),
			zap.String("ip", c.ClientIP()),
			zap.Duration("duration", time.Since(start)),
		)
	}
}

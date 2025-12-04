package routes

import (
	userhttp "financial-health/internal/delivery/http"
	"financial-health/internal/domain"

	"github.com/gin-gonic/gin"
)

type RouteConfig struct {
	Router         *gin.Engine
	UserUsecase    domain.UserUseCase
	AuthMiddleware gin.HandlerFunc
}

func RegisterRoutes(cfg *RouteConfig) {
	userHandler := userhttp.NewUserHandler(cfg.UserUsecase)

	api := cfg.Router.Group("/api/v1")
	{
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)
		api.POST("/logout", userHandler.Logout)
	}

	protected := api.Group("/users")
	protected.Use(cfg.AuthMiddleware)
	{
		protected.GET("/profile", userHandler.Profile)
	}
}

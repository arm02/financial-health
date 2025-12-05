package routes

import (
	"financial-health/internal/delivery/http"
	"financial-health/internal/domain"

	"github.com/gin-gonic/gin"
)

type RouteConfig struct {
	Router             *gin.Engine
	UserUsecase        domain.UserUseCase
	LoanUseCase        domain.LoanUseCase
	TransactionUseCase domain.TransactionUseCase
	AuthMiddleware     gin.HandlerFunc
}

func RegisterRoutes(cfg *RouteConfig) {
	userHandler := http.NewUserHandler(cfg.UserUsecase)
	loanHandler := http.NewLoanHandler(cfg.LoanUseCase)
	transactionHandler := http.NewTransactionHandler(cfg.TransactionUseCase)

	api := cfg.Router.Group("/api/v1")
	{
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)
		api.POST("/logout", userHandler.Logout)
	}

	protected := api.Group("/")
	protected.Use(cfg.AuthMiddleware)
	{
		usersGroup := protected.Group("/users")
		usersGroup.GET("/profile", userHandler.Profile)

		loansGroup := protected.Group("/loans")
		loansGroup.GET("/all", loanHandler.GetAllLoans)
		loansGroup.POST("/create", loanHandler.CreateLoan)
		loansGroup.GET("/:id", loanHandler.GetLoan)
		loansGroup.GET("/details/:id", loanHandler.GetLoanDetails)

		transactionsGroup := protected.Group("/transactions")
		transactionsGroup.POST("/create", transactionHandler.CreateTransaction)
		transactionsGroup.GET("/all", transactionHandler.GetAllTransaction)
		transactionsGroup.DELETE("/:id", transactionHandler.DeleteTransaction)
		transactionsGroup.PUT("/:id", transactionHandler.UpdateTransaction)
	}
}

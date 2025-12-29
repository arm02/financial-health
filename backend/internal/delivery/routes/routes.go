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
	DashboardUseCase   domain.DashboardUseCase
	ExpensesUseCase    domain.ExpensesUseCase
	AnalyticsUseCase   domain.AnalyticsUseCase
	TodoUseCase        domain.TodoUseCase
	AuthMiddleware     gin.HandlerFunc
}

func RegisterRoutes(cfg *RouteConfig) {
	userHandler := http.NewUserHandler(cfg.UserUsecase)
	loanHandler := http.NewLoanHandler(cfg.LoanUseCase)
	transactionHandler := http.NewTransactionHandler(cfg.TransactionUseCase)
	dashboardHandler := http.NewDashboardnHandler(cfg.DashboardUseCase)
	expensesHandler := http.NewExpensesHandler(cfg.ExpensesUseCase)
	analyticsHandler := http.NewAnalyticsHandler(cfg.AnalyticsUseCase)
	todoHandler := http.NewTodoHandler(cfg.TodoUseCase)

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
		loansGroup.DELETE("/:id", loanHandler.DeleteLoan)
		loansGroup.GET("/payment-history/:id", loanHandler.GetPaymentHistory)

		transactionsGroup := protected.Group("/transactions")
		transactionsGroup.POST("/create", transactionHandler.CreateTransaction)
		transactionsGroup.GET("/all", transactionHandler.GetAllTransaction)
		transactionsGroup.DELETE("/:id", transactionHandler.DeleteTransaction)
		transactionsGroup.PUT("/:id", transactionHandler.UpdateTransaction)

		dashboardGroup := protected.Group("/dashboard")
		dashboardGroup.GET("/summary", dashboardHandler.GetSummary)
		dashboardGroup.GET("/chart", dashboardHandler.GetChartSummary)
		dashboardGroup.GET("/chart/daily", dashboardHandler.GetDailyChartSummary)

		expensesGroup := protected.Group("/expenses")
		expensesGroup.POST("/create", expensesHandler.CreateExpenses)
		expensesGroup.GET("/all", expensesHandler.GetAllExpenses)
		expensesGroup.GET("/:id", expensesHandler.GetDetailExpenses)
		expensesGroup.DELETE("/:id", expensesHandler.DeleteExpenses)
		expensesGroup.PUT("/:id", expensesHandler.UpdateExpenses)

		analyticsGroup := protected.Group("/analytics")
		analyticsGroup.GET("/health", analyticsHandler.GetFinancialHealth)

		todosGroup := protected.Group("/todos")
		todosGroup.POST("/create", todoHandler.Create)
		todosGroup.GET("/all", todoHandler.GetAll)
		todosGroup.GET("/:id", todoHandler.GetByID)
		todosGroup.PUT("/:id", todoHandler.Update)
		todosGroup.DELETE("/:id", todoHandler.Delete)
		todosGroup.PATCH("/:id/toggle", todoHandler.ToggleStatus)
	}
}

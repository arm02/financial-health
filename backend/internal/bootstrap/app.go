package bootstrap

import (
	"financial-health/internal/config"
	"financial-health/internal/delivery/routes"
	"financial-health/internal/middleware"
	"financial-health/internal/repository"
	"financial-health/internal/usecase"

	"database/sql"
	"os"

	"github.com/gin-gonic/gin"
)

type App struct {
	Router *gin.Engine
	DB     *sql.DB
}

func InitializeApp(db *sql.DB) *App {
	logger, _ := config.NewLogger()
	gin.SetMode(os.Getenv("GIN_MODE"))

	router := gin.New()
	router.Use(middleware.Recovery(logger))
	router.Use(gin.Logger())
	router.Use(middleware.RequestID())
	router.Use(middleware.ResponseTime())
	router.Use(middleware.CORS())
	router.Use(middleware.AuditMiddleware(logger))

	userRepo := repository.NewUserRepository(db)
	userUseCase := usecase.NewUserUseCase(userRepo, os.Getenv("JWT_SECRET"))

	loanRepo := repository.NewLoanRepository(db)
	loanUseCase := usecase.NewLoanUseCase(loanRepo)

	transactionRepo := repository.NewTransactionRepository(db)
	transactionUseCase := usecase.NewTransactionUseCase(transactionRepo, loanRepo)

	dashboardRepo := repository.NewDashboardRepository(db)
	dashboardUseCase := usecase.NewDashboardUseCase(dashboardRepo)
	expensesRepo := repository.NewExpensesRepository(db)
	expensesUseCase := usecase.NewExpensesUseCase(expensesRepo, loanRepo)

	analyticsRepo := repository.NewAnalyticsRepository(db)
	analyticsUseCase := usecase.NewAnalyticsUseCase(analyticsRepo)

	todoRepo := repository.NewTodoRepository(db)
	todoUseCase := usecase.NewTodoUseCase(todoRepo)

	routes.RegisterRoutes(&routes.RouteConfig{
		Router:             router,
		UserUsecase:        userUseCase,
		LoanUseCase:        loanUseCase,
		TransactionUseCase: transactionUseCase,
		DashboardUseCase:   dashboardUseCase,
		ExpensesUseCase:    expensesUseCase,
		AnalyticsUseCase:   analyticsUseCase,
		TodoUseCase:        todoUseCase,
		AuthMiddleware:     middleware.JWTMiddleware(),
	})

	return &App{
		Router: router,
		DB:     db,
	}
}

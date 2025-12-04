package main

import (
	"context"
	"database/sql"
	"financial-health/internal/config"
	"financial-health/internal/delivery/routes"
	"financial-health/internal/middleware"
	"financial-health/internal/repository"
	"financial-health/internal/usecase"
	"financial-health/internal/utils"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	port := utils.GetEnv("PORT", ":8080")
	db, err := sql.Open("mysql", config.Load().DSN())
	if err != nil {
		log.Fatalf("Failed to open db connection: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping db: %v", err)
	}

	userRepo := repository.NewUserRepository(db)
	userUsecase := usecase.NewUserUseCase(userRepo, os.Getenv("JWT_SECRET"))

	gin.SetMode(utils.GetEnv("GIN_MODE", "debug"))
	logger, _ := config.NewLogger()
	router := gin.New()
	router.Use(middleware.Recovery(logger))
	router.Use(gin.Logger())
	router.Use(middleware.RequestID())
	router.Use(middleware.ResponseTime())
	router.Use(middleware.CORS())
	router.Use(middleware.AuditMiddleware(logger))
	routes.RegisterRoutes(&routes.RouteConfig{
		Router:         router,
		UserUsecase:    userUsecase,
		AuthMiddleware: middleware.JWTMiddleware(),
	})

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	go func() {
		log.Printf("Server starting on port %s\n", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown: ", err)
	}

	log.Println("Server exiting")
}

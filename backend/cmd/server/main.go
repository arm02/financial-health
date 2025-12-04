package main

import (
	"context"
	"database/sql"
	"financial-health/internal/bootstrap"
	"financial-health/internal/config"
	"financial-health/internal/utils"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

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

	app := bootstrap.InitializeApp(db)

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: app.Router,
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

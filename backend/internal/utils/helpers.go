package utils

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var envLoaded = false

func LoadEnv() {
	if envLoaded {
		return
	}

	err := godotenv.Load()
	if err != nil {
		log.Println("INFO: .env file not found, using system env")
	}

	envLoaded = true
}

func GetEnv(key, fallback string) string {
	LoadEnv()
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

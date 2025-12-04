package config

import (
	"financial-health/internal/utils"
	"fmt"
)

type Config struct {
	DBHost string
	DBPort string
	DBUser string
	DBPass string
	DBName string
}

func Load() *Config {
	return &Config{
		DBHost: utils.GetEnv("DB_HOST", "127.0.0.1"),
		DBPort: utils.GetEnv("DB_PORT", "3306"),
		DBUser: utils.GetEnv("DB_USER", "root"),
		DBPass: utils.GetEnv("DB_PASSWORD", ""),
		DBName: utils.GetEnv("DB_DATABASE", "financial_health"),
	}
}

func (c *Config) DSN() string {
	return fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?parseTime=true",
		c.DBUser, c.DBPass, c.DBHost, c.DBPort, c.DBName,
	)
}

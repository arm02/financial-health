package domain

import (
	"context"
	"time"
)

type Expenses struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	Title     string    `json:"title"`
	Type      string    `json:"type"` // fixed, other will come soon
	Amount    float64   `json:"amount"`
	CreatedAt time.Time `json:"created_at"`
}

type ExpensesUseCase interface {
	CreateExpenses(ctx context.Context, trx *Expenses) error
	GetAllExpenses(ctx context.Context, userID int64, page, limit int, sortBy, sortType, query, startDate, endDate string) (*RowsList[Expenses], error)
	GetDetailExpenses(ctx context.Context, userID int64, expId int64) (*Expenses, error)
	DeleteExpenses(ctx context.Context, userID, trxID int64) (string, error)
	UpdateExpenses(ctx context.Context, trx *Expenses) error
}

type ExpensesRepository interface {
	Create(ctx context.Context, trx *Expenses) error
	GetAll(ctx context.Context, userID int64, page, limit int, sortBy, sortType, query, startDate, endDate string) ([]Expenses, int64, error)
	GetByID(ctx context.Context, trxID int64) (*Expenses, error)
	Delete(ctx context.Context, trxID int64) (string, error)
	Update(ctx context.Context, trx *Expenses) error
}

package domain

import (
	"context"
	"time"
)

type Transaction struct {
	ID              int64     `json:"id"`
	UserID          int64     `json:"user_id"`
	Title           string    `json:"title"`
	Type            string    `json:"type"` // debit, credit, loan_payment, saving
	ReferenceID     int64     `json:"reference_id"`
	Amount          float64   `json:"amount"`
	TransactionDate string    `json:"transaction_date"`
	CreatedAt       time.Time `json:"created_at"`
}

type TransactionUseCase interface {
	CreateTransaction(ctx context.Context, trx *Transaction) error
	GetAllTransaction(ctx context.Context, userID int64, page, limit int, sortBy, sortType, query, tipe, startDate, endDate string) (*RowsList[Transaction], error)
	DeleteTransaction(ctx context.Context, userID, trxID int64) (string, error)
	UpdateTransaction(ctx context.Context, trx *Transaction) error
}

type TransactionRepository interface {
	Create(ctx context.Context, trx *Transaction) error
	GetAll(ctx context.Context, userID int64, page, limit int, sortBy, sortType, query, tipe, startDate, endDate string) ([]Transaction, int64, error)
	GetByID(ctx context.Context, trxID int64) (*Transaction, error)
	Delete(ctx context.Context, trxID int64) (string, error)
	Update(ctx context.Context, trx *Transaction) error
}

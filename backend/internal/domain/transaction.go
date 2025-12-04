package domain

import (
	"context"
	"time"
)

type Transaction struct {
	ID              int64     `json:"id"`
	Title           string    `json:"title"`
	Type            string    `json:"type"` // debit, credit, loan_payment
	ReferenceID     int64     `json:"reference_id"`
	Amount          float64   `json:"amount"`
	TransactionDate time.Time `json:"transaction_date"`
}

type TransactionUseCase interface {
	CreateTransaction(ctx context.Context, trx *Transaction) error
}

type TransactionRepository interface {
	Create(ctx context.Context, trx *Transaction) error
}

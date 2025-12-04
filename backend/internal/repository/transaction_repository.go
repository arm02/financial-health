package repository

import (
	"context"
	"database/sql"
	"financial-health/internal/domain"
)

type TransactionRepositoryImpl struct {
	db *sql.DB
}

func NewTransactionRepository(db *sql.DB) domain.TransactionRepository {
	return &TransactionRepositoryImpl{db}
}

func (r *TransactionRepositoryImpl) Create(ctx context.Context, trx *domain.Transaction) error {
	query := `INSERT INTO transactions (title, type, reference_id, amount) VALUES (?, ?, ?, ?)`
	_, err := r.db.ExecContext(ctx, query, trx.Title, trx.Type, trx.ReferenceID, trx.Amount)
	return err
}

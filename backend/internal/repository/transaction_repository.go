package repository

import (
	"context"
	"database/sql"
	"financial-health/internal/domain"
	"fmt"
	"strings"
)

type TransactionRepositoryImpl struct {
	db *sql.DB
}

func NewTransactionRepository(db *sql.DB) domain.TransactionRepository {
	return &TransactionRepositoryImpl{db}
}

func (r *TransactionRepositoryImpl) Create(ctx context.Context, trx *domain.Transaction) error {
	query := `INSERT INTO transactions (user_id, title, type, reference_id, amount, transaction_date) VALUES (?, ?, ?, ?, ?, ?)`
	_, err := r.db.ExecContext(ctx, query, trx.UserID, trx.Title, trx.Type, trx.ReferenceID, trx.Amount, trx.TransactionDate)
	return err
}

func (r *TransactionRepositoryImpl) GetAll(ctx context.Context, userID int64, page, limit int, sortBy, sortType, searchTitle, tipe, startDate, endDate string) ([]domain.Transaction, int64, error) {
	offset := (page - 1) * limit

	allowedSortColumns := map[string]bool{
		"title":            true,
		"type":             true,
		"amount":           true,
		"transaction_date": true,
	}
	if !allowedSortColumns[sortBy] {
		sortBy = "transaction_date"
	}

	sortType = strings.ToUpper(sortType)
	if sortType != "ASC" && sortType != "DESC" {
		sortType = "DESC"
	}

	query := `
        SELECT id, user_id, title, type, reference_id, amount, transaction_date, created_at
        FROM transactions
        WHERE user_id = ?`

	args := []interface{}{userID}
	countArgs := []interface{}{userID}

	if tipe != "" {
		tipeArr := strings.Split(tipe, ",")
		placeholders := strings.Repeat("?,", len(tipeArr))
		placeholders = placeholders[:len(placeholders)-1]
		query += fmt.Sprintf(" AND type IN (%s)", placeholders)
		for _, t := range tipeArr {
			args = append(args, t)
		}
	}

	if searchTitle != "" {
		query += " AND title LIKE ?"
		args = append(args, "%"+searchTitle+"%")
		countArgs = append(countArgs, "%"+searchTitle+"%")
	}

	if startDate != "" && endDate != "" {
		query += " AND DATE(transaction_date) BETWEEN ? AND ?"
		args = append(args, startDate, endDate)
		countArgs = append(countArgs, startDate, endDate)
	}

	query += fmt.Sprintf(" ORDER BY %s %s LIMIT ? OFFSET ?", sortBy, sortType)
	args = append(args, limit, offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var transactions []domain.Transaction
	for rows.Next() {
		var t domain.Transaction
		if err := rows.Scan(
			&t.ID, &t.UserID, &t.Title, &t.Type, &t.ReferenceID,
			&t.Amount, &t.TransactionDate, &t.CreatedAt,
		); err != nil {
			return nil, 0, err
		}
		transactions = append(transactions, t)
	}

	countQuery := `SELECT COUNT(*) FROM transactions WHERE user_id = ?`
	if searchTitle != "" {
		countQuery += " AND title LIKE ?"
	}
	if startDate != "" && endDate != "" {
		countQuery += " AND DATE(transaction_date) BETWEEN ? AND ?"
	}

	var total int64
	err = r.db.QueryRowContext(ctx, countQuery, countArgs...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	return transactions, total, nil
}

func (r *TransactionRepositoryImpl) GetByID(ctx context.Context, trxID int64) (*domain.Transaction, error) {
	query := `SELECT id, user_id, title, type, reference_id, amount, transaction_date, created_at FROM transactions WHERE id = ?`
	row := r.db.QueryRowContext(ctx, query, trxID)

	var t domain.Transaction
	if err := row.Scan(&t.ID, &t.UserID, &t.Title, &t.Type, &t.ReferenceID, &t.Amount, &t.TransactionDate, &t.CreatedAt); err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *TransactionRepositoryImpl) Delete(ctx context.Context, trxID int64) (string, error) {
	query := "DELETE FROM transactions WHERE id = ?"
	_, err := r.db.ExecContext(ctx, query, trxID)
	if err != nil {
		return "", err
	}
	return "success", nil
}

func (r *TransactionRepositoryImpl) Update(ctx context.Context, t *domain.Transaction) error {
	query := `
        UPDATE transactions
        SET title = ?, type = ?, reference_id = ?, amount = ?, transaction_date = ?
        WHERE id = ?`

	_, err := r.db.ExecContext(ctx, query,
		t.Title, t.Type, t.ReferenceID, t.Amount, t.TransactionDate, t.ID)
	if err != nil {
		return err
	}

	return nil
}

package repository

import (
	"context"
	"database/sql"
	"financial-health/internal/domain"
	"fmt"
	"strings"
)

type ExpensesRepositoryImpl struct {
	db *sql.DB
}

func NewExpensesRepository(db *sql.DB) domain.ExpensesRepository {
	return &ExpensesRepositoryImpl{db}
}

func (r *ExpensesRepositoryImpl) Create(ctx context.Context, exp *domain.Expenses) error {
	query := `INSERT INTO expenses (user_id, title, type, amount) VALUES (?, ?, ?, ?)`
	_, err := r.db.ExecContext(ctx, query, exp.UserID, exp.Title, exp.Type, exp.Amount)
	return err
}

func (r *ExpensesRepositoryImpl) GetAll(ctx context.Context, userID int64, page, limit int, sortBy, sortType, searchTitle string) ([]domain.Expenses, int64, error) {
	offset := (page - 1) * limit

	allowedSortColumns := map[string]bool{
		"title":      true,
		"type":       true,
		"amount":     true,
		"created_at": true,
	}
	if !allowedSortColumns[sortBy] {
		sortBy = "created_at"
	}

	sortType = strings.ToUpper(sortType)
	if sortType != "ASC" && sortType != "DESC" {
		sortType = "DESC"
	}

	query := `
        SELECT id, user_id, title, type, amount, created_at
        FROM expenses
        WHERE user_id = ?`

	args := []interface{}{userID}

	if searchTitle != "" {
		query += " AND title LIKE ?"
		args = append(args, "%"+searchTitle+"%")
	}

	query += fmt.Sprintf(" ORDER BY %s %s LIMIT ? OFFSET ?", sortBy, sortType)
	args = append(args, limit, offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var expenses []domain.Expenses
	for rows.Next() {
		var e domain.Expenses
		if err := rows.Scan(
			&e.ID, &e.UserID, &e.Title, &e.Type,
			&e.Amount, &e.CreatedAt,
		); err != nil {
			return nil, 0, err
		}
		expenses = append(expenses, e)
	}

	countQuery := `SELECT COUNT(*) FROM expenses WHERE user_id = ?`
	countArgs := []interface{}{userID}
	if searchTitle != "" {
		countQuery += " AND title LIKE ?"
		countArgs = append(countArgs, "%"+searchTitle+"%")
	}

	var total int64
	err = r.db.QueryRowContext(ctx, countQuery, countArgs...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	return expenses, total, nil
}

func (r *ExpensesRepositoryImpl) GetByID(ctx context.Context, expID int64) (*domain.Expenses, error) {
	query := `SELECT id, user_id, title, type, amount, created_at FROM expenses WHERE id = ?`
	row := r.db.QueryRowContext(ctx, query, expID)

	var e domain.Expenses
	if err := row.Scan(&e.ID, &e.UserID, &e.Title, &e.Type, &e.Amount, &e.CreatedAt); err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *ExpensesRepositoryImpl) Delete(ctx context.Context, expID int64) (string, error) {
	query := "DELETE FROM expenses WHERE id = ?"
	_, err := r.db.ExecContext(ctx, query, expID)
	if err != nil {
		return "", err
	}
	return "success", nil
}

func (r *ExpensesRepositoryImpl) Update(ctx context.Context, e *domain.Expenses) error {
	query := `
        UPDATE expenses
        SET title = ?, type = ?, amount = ?
        WHERE id = ?`

	_, err := r.db.ExecContext(ctx, query,
		e.Title, e.Type, e.Amount, e.ID)
	if err != nil {
		return err
	}

	return nil
}

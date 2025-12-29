package repository

import (
	"context"
	"database/sql"
	"financial-health/internal/domain"
	"fmt"
	"strings"
)

type TodoRepositoryImpl struct {
	db *sql.DB
}

func NewTodoRepository(db *sql.DB) domain.TodoRepository {
	return &TodoRepositoryImpl{db}
}

func (r *TodoRepositoryImpl) Create(ctx context.Context, todo *domain.Todo) error {
	query := `INSERT INTO todos (user_id, title, description, priority, status, due_date) VALUES (?, ?, ?, ?, ?, ?)`
	result, err := r.db.ExecContext(ctx, query, todo.UserID, todo.Title, todo.Description, todo.Priority, todo.Status, todo.DueDate)
	if err != nil {
		return err
	}
	id, _ := result.LastInsertId()
	todo.ID = id
	return nil
}

func (r *TodoRepositoryImpl) GetAll(ctx context.Context, userID int64, page, limit int, sortBy, sortType, searchTitle, status, priority string) ([]domain.Todo, int64, error) {
	offset := (page - 1) * limit

	allowedSortColumns := map[string]bool{
		"title":      true,
		"priority":   true,
		"status":     true,
		"due_date":   true,
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
        SELECT id, user_id, title, description, priority, status, due_date, created_at, updated_at
        FROM todos
        WHERE user_id = ?`

	args := []interface{}{userID}
	countArgs := []interface{}{userID}

	if searchTitle != "" {
		query += " AND title LIKE ?"
		args = append(args, "%"+searchTitle+"%")
		countArgs = append(countArgs, "%"+searchTitle+"%")
	}

	if status != "" {
		statusArr := strings.Split(status, ",")
		placeholders := strings.Repeat("?,", len(statusArr))
		placeholders = placeholders[:len(placeholders)-1]
		query += fmt.Sprintf(" AND status IN (%s)", placeholders)
		for _, s := range statusArr {
			args = append(args, s)
			countArgs = append(countArgs, s)
		}
	}

	if priority != "" {
		priorityArr := strings.Split(priority, ",")
		placeholders := strings.Repeat("?,", len(priorityArr))
		placeholders = placeholders[:len(placeholders)-1]
		query += fmt.Sprintf(" AND priority IN (%s)", placeholders)
		for _, p := range priorityArr {
			args = append(args, p)
			countArgs = append(countArgs, p)
		}
	}

	query += fmt.Sprintf(" ORDER BY %s %s LIMIT ? OFFSET ?", sortBy, sortType)
	args = append(args, limit, offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var todos []domain.Todo
	for rows.Next() {
		var t domain.Todo
		if err := rows.Scan(
			&t.ID, &t.UserID, &t.Title, &t.Description, &t.Priority,
			&t.Status, &t.DueDate, &t.CreatedAt, &t.UpdatedAt,
		); err != nil {
			return nil, 0, err
		}
		todos = append(todos, t)
	}

	countQuery := `SELECT COUNT(*) FROM todos WHERE user_id = ?`
	if searchTitle != "" {
		countQuery += " AND title LIKE ?"
	}
	if status != "" {
		statusArr := strings.Split(status, ",")
		placeholders := strings.Repeat("?,", len(statusArr))
		placeholders = placeholders[:len(placeholders)-1]
		countQuery += fmt.Sprintf(" AND status IN (%s)", placeholders)
	}
	if priority != "" {
		priorityArr := strings.Split(priority, ",")
		placeholders := strings.Repeat("?,", len(priorityArr))
		placeholders = placeholders[:len(placeholders)-1]
		countQuery += fmt.Sprintf(" AND priority IN (%s)", placeholders)
	}

	var total int64
	err = r.db.QueryRowContext(ctx, countQuery, countArgs...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	return todos, total, nil
}

func (r *TodoRepositoryImpl) GetByID(ctx context.Context, todoID int64) (*domain.Todo, error) {
	query := `SELECT id, user_id, title, description, priority, status, due_date, created_at, updated_at FROM todos WHERE id = ?`
	row := r.db.QueryRowContext(ctx, query, todoID)

	var t domain.Todo
	if err := row.Scan(&t.ID, &t.UserID, &t.Title, &t.Description, &t.Priority, &t.Status, &t.DueDate, &t.CreatedAt, &t.UpdatedAt); err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *TodoRepositoryImpl) Update(ctx context.Context, todo *domain.Todo) error {
	query := `UPDATE todos SET title = ?, description = ?, priority = ?, status = ?, due_date = ?, updated_at = NOW() WHERE id = ?`
	_, err := r.db.ExecContext(ctx, query, todo.Title, todo.Description, todo.Priority, todo.Status, todo.DueDate, todo.ID)
	return err
}

func (r *TodoRepositoryImpl) Delete(ctx context.Context, todoID int64) error {
	query := `DELETE FROM todos WHERE id = ?`
	_, err := r.db.ExecContext(ctx, query, todoID)
	return err
}

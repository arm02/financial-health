package domain

import (
	"context"
	"time"
)

type Todo struct {
	ID          int64      `json:"id"`
	UserID      int64      `json:"user_id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Priority    string     `json:"priority"` // low, medium, high
	Status      string     `json:"status"`   // pending, in_progress, completed
	DueDate     *string    `json:"due_date"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at"`
}

type TodoUseCase interface {
	Create(ctx context.Context, todo *Todo) error
	GetAll(ctx context.Context, userID int64, page, limit int, sortBy, sortType, query, status, priority string) (*RowsList[Todo], error)
	GetByID(ctx context.Context, userID, todoID int64) (*Todo, error)
	Update(ctx context.Context, todo *Todo) error
	Delete(ctx context.Context, userID, todoID int64) error
	ToggleStatus(ctx context.Context, userID, todoID int64) (*Todo, error)
}

type TodoRepository interface {
	Create(ctx context.Context, todo *Todo) error
	GetAll(ctx context.Context, userID int64, page, limit int, sortBy, sortType, query, status, priority string) ([]Todo, int64, error)
	GetByID(ctx context.Context, todoID int64) (*Todo, error)
	Update(ctx context.Context, todo *Todo) error
	Delete(ctx context.Context, todoID int64) error
}

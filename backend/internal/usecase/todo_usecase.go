package usecase

import (
	"context"
	"database/sql"
	"errors"
	"financial-health/internal/domain"
	"financial-health/internal/utils"
	"time"
)

type TodoUseCase struct {
	todoRepo domain.TodoRepository
}

func NewTodoUseCase(todoRepo domain.TodoRepository) domain.TodoUseCase {
	return &TodoUseCase{
		todoRepo: todoRepo,
	}
}

func (u *TodoUseCase) Create(ctx context.Context, todo *domain.Todo) error {
	if todo.Title == "" {
		return errors.New("title is required")
	}
	if todo.Priority == "" {
		todo.Priority = "medium"
	}
	if todo.Status == "" {
		todo.Status = "pending"
	}
	return u.todoRepo.Create(ctx, todo)
}

func (u *TodoUseCase) GetAll(ctx context.Context, userID int64, page, limit int, sortBy, sortType, query, status, priority string) (*domain.RowsList[domain.Todo], error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 20
	}

	todos, total, err := u.todoRepo.GetAll(ctx, userID, page, limit, sortBy, sortType, query, status, priority)
	if err != nil {
		return nil, err
	}

	for i := range todos {
		todos[i].DueDate = formatDateOnly(todos[i].DueDate)
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	return &domain.RowsList[domain.Todo]{
		Rows:       todos,
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}, nil
}

func (u *TodoUseCase) GetByID(ctx context.Context, userID, todoID int64) (*domain.Todo, error) {
	todo, err := u.todoRepo.GetByID(ctx, todoID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, utils.NewNotFoundError("todo not found", err)
		}
		return nil, err
	}
	if todo.UserID != userID {
		return nil, utils.NewNotFoundError("todo not found", nil)
	}
	return todo, nil
}

func (u *TodoUseCase) Update(ctx context.Context, todo *domain.Todo) error {
	existing, err := u.todoRepo.GetByID(ctx, todo.ID)
	if err != nil {
		return errors.New("todo not found")
	}
	if existing.UserID != todo.UserID {
		return errors.New("todo not found")
	}
	if todo.Title == "" {
		return errors.New("title is required")
	}
	return u.todoRepo.Update(ctx, todo)
}

func (u *TodoUseCase) Delete(ctx context.Context, userID, todoID int64) error {
	existing, err := u.todoRepo.GetByID(ctx, todoID)
	if err != nil {
		return errors.New("todo not found")
	}
	if existing.UserID != userID {
		return errors.New("todo not found")
	}
	return u.todoRepo.Delete(ctx, todoID)
}

func (u *TodoUseCase) ToggleStatus(ctx context.Context, userID, todoID int64) (*domain.Todo, error) {
	todo, err := u.todoRepo.GetByID(ctx, todoID)
	if err != nil {
		return nil, errors.New("todo not found")
	}
	if todo.UserID != userID {
		return nil, errors.New("todo not found")
	}

	if todo.Status == "completed" {
		todo.Status = "pending"
	} else {
		todo.Status = "completed"
	}

	todo.DueDate = formatDateOnly(todo.DueDate)
	err = u.todoRepo.Update(ctx, todo)
	if err != nil {
		return nil, err
	}
	return todo, nil
}

func formatDateOnly(dateStr *string) *string {
	if dateStr == nil || *dateStr == "" {
		return nil
	}

	t, err := time.Parse(time.RFC3339, *dateStr)
	if err != nil {
		return dateStr
	}

	formatted := t.Format("2006-01-02")
	return &formatted
}

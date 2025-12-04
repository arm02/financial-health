package repository

import (
	"context"
	"database/sql"
	"errors"
	"financial-health/internal/domain"
	"financial-health/internal/utils"
)

type UserRepositoryImpl struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) domain.UserRepository {
	return &UserRepositoryImpl{db}
}

func (r *UserRepositoryImpl) Create(ctx context.Context, user *domain.User) error {
	query := "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)"
	res, err := r.db.ExecContext(ctx, query, user.Fullname, user.Email, user.Password)
	if err != nil {
		return utils.NewSystemError("Database error", err)
	}
	id, err := res.LastInsertId()
	if err != nil {
		return utils.NewSystemError("Database error", err)
	}
	user.ID = id
	return nil
}

func (r *UserRepositoryImpl) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	query := "SELECT id, fullname, email, password, created_at FROM users WHERE email = ?"
	row := r.db.QueryRowContext(ctx, query, email)

	var user domain.User
	if err := row.Scan(&user.ID, &user.Fullname, &user.Email, &user.Password, &user.CreatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, utils.NewBusinessError("User not found", err)
		}
		return nil, utils.NewSystemError("Database error", err)
	}
	return &user, nil
}

func (r *UserRepositoryImpl) GetByID(ctx context.Context, id int64) (*domain.User, error) {
	query := "SELECT id, fullname, email, password, created_at FROM users WHERE id = ?"
	row := r.db.QueryRowContext(ctx, query, id)

	var user domain.User
	if err := row.Scan(&user.ID, &user.Fullname, &user.Email, &user.Password, &user.CreatedAt); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, utils.NewBusinessError("User not found", err)
		}
		return nil, utils.NewSystemError("Database error", err)
	}
	return &user, nil
}

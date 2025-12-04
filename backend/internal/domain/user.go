package domain

import (
	"context"
	"time"
)

type User struct {
	ID        int64     `json:"id"`
	Fullname  string    `json:"fullname"`
	Email     string    `json:"email"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
}

type UserLogin struct {
	Fullname string `json:"fullname"`
	Email    string `json:"email"`
	Token    string `json:"token"`
}

type UserUseCase interface {
	Register(ctx context.Context, fullname, email, password string) error
	Login(ctx context.Context, email, password string) (*UserLogin, error)
	GetByID(ctx context.Context, id int64) (*User, error)
}

type UserRepository interface {
	Create(ctx context.Context, user *User) error
	GetByEmail(ctx context.Context, email string) (*User, error)
	GetByID(ctx context.Context, id int64) (*User, error)
}

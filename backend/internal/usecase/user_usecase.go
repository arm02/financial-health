package usecase

import (
	"context"
	"errors"
	"financial-health/internal/domain"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type UserUseCase struct {
	userRepository domain.UserRepository
	jwtSecret      []byte
	tokenExpiry    time.Duration
}

func NewUserUseCase(repo domain.UserRepository, secret string) domain.UserUseCase {
	return &UserUseCase{
		userRepository: repo,
		jwtSecret:      []byte(secret),
		tokenExpiry:    15 * time.Minute,
	}
}

func (u *UserUseCase) Register(ctx context.Context, fullname, email, password string) error {
	hashedPass, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &domain.User{
		Fullname: fullname,
		Email:    email,
		Password: string(hashedPass),
	}

	if err := u.userRepository.Create(ctx, user); err != nil {
		return err
	}

	return nil
}

func (u *UserUseCase) Login(ctx context.Context, email, password string) (*domain.UserLogin, error) {
	user, err := u.userRepository.GetByEmail(ctx, email)
	if err != nil {
		return nil, errors.New("email not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("wrong password")
	}

	claims := jwt.MapClaims{
		"user_id":  user.ID,
		"email":    user.Email,
		"fullname": user.Fullname,
		"exp":      time.Now().Add(u.tokenExpiry).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString(u.jwtSecret)
	if err != nil {
		return nil, err
	}

	return &domain.UserLogin{
		Fullname: user.Fullname,
		Email:    user.Email,
		Token:    signedToken,
	}, nil
}

func (u *UserUseCase) GetByID(ctx context.Context, id int64) (*domain.User, error) {
	return u.userRepository.GetByID(ctx, id)
}

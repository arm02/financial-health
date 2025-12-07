package utils

import (
	"errors"
)

type ErrorType string

var ErrorCode = map[ErrorType]string{
	ValidationError: "E001",
	BusinessError:   "E002",
	AuthError:       "E003",
	SystemError:     "E500",
}

const (
	ValidationError ErrorType = "VALIDATION_ERROR"
	BusinessError   ErrorType = "BUSINESS_ERROR"
	SystemError     ErrorType = "SYSTEM_ERROR"
	AuthError       ErrorType = "AUTH_ERROR"
	NotFoundError   ErrorType = "NOT_FOUND_ERROR"
)

type AppError struct {
	Type    ErrorType
	Message string
	Err     error
}

type ResponseError struct {
	Code      int       `json:"code"`
	Status    bool      `json:"status"`
	Type      ErrorType `json:"type"`
	Message   string    `json:"message"`
	ErrorCode string    `json:"error_code"`
	Error     string    `json:"error"`
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return e.Err.Error()
	}
	return e.Message
}

func NewValidationError(msg string, err error) *AppError {
	return &AppError{
		Type:    ValidationError,
		Message: msg,
		Err:     err,
	}
}

func NewBusinessError(msg string, err error) *AppError {
	return &AppError{
		Type:    BusinessError,
		Message: msg,
		Err:     err,
	}
}

func NewSystemError(msg string, err error) *AppError {
	return &AppError{
		Type:    SystemError,
		Message: msg,
		Err:     err,
	}
}

func NewAuthError(msg string, err error) *AppError {
	return &AppError{
		Type:    AuthError,
		Message: msg,
		Err:     err,
	}
}

func IsAppError(err error) (*AppError, bool) {
	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr, true
	}
	return nil, false
}

func NewNotFoundError(msg string, err error) *AppError {
	return &AppError{
		Type:    NotFoundError,
		Message: msg,
		Err:     err,
	}
}

package usecase

import (
	"context"
	"database/sql"
	"errors"
	"financial-health/internal/constants"
	"financial-health/internal/domain"
	"financial-health/internal/utils"
)

type ExpensesUseCase struct {
	expRepo domain.ExpensesRepository
}

func NewExpensesUseCase(expRepo domain.ExpensesRepository, loanRepo domain.LoanRepository) domain.ExpensesUseCase {
	return &ExpensesUseCase{
		expRepo: expRepo,
	}
}

func (u *ExpensesUseCase) CreateExpenses(ctx context.Context, exp *domain.Expenses) error {
	if exp.Type != "fixed" {
		return errors.New(constants.TYPE_IS_INVALID)
	}
	if exp.Type == "fixed" {
		if exp.Amount <= 0 {
			return errors.New(constants.AMOUNT_REQUIRED)
		}
		if exp.Title == "" {
			return errors.New(constants.TITLE_REQUIRED)
		}
	}
	return u.expRepo.Create(ctx, exp)
}

func (u *ExpensesUseCase) GetAllExpenses(ctx context.Context, userID int64, page, limit int, sortBy, sortType, query, startDate, endDate string) (*domain.RowsList[domain.Expenses], error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}

	expenses, total, err := u.expRepo.GetAll(ctx, userID, page, limit, sortBy, sortType, query, startDate, endDate)
	if err != nil {
		return nil, err
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	return &domain.RowsList[domain.Expenses]{
		Rows:       expenses,
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}, nil
}

func (u *ExpensesUseCase) GetDetailExpenses(ctx context.Context, userID int64, expId int64) (*domain.Expenses, error) {
	expenses, err := u.expRepo.GetByID(ctx, expId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, utils.NewNotFoundError(constants.EXPENSES_NOT_FOUND, err)
		}
		return nil, err
	}

	if expenses == nil || expenses.UserID != userID {
		return nil, errors.New(constants.EXPENSES_NOT_FOUND)
	}

	return &domain.Expenses{
		ID:        expenses.ID,
		UserID:    expenses.UserID,
		Title:     expenses.Title,
		Type:      expenses.Type,
		Amount:    expenses.Amount,
		CreatedAt: expenses.CreatedAt,
	}, nil
}

func (u *ExpensesUseCase) DeleteExpenses(ctx context.Context, userID, expID int64) (string, error) {
	detail, err := u.expRepo.GetByID(ctx, expID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", utils.NewNotFoundError(constants.EXPENSES_NOT_FOUND, err)
		}
		return "", err
	}
	if detail == nil || detail.UserID != userID {
		return "", utils.NewNotFoundError(constants.EXPENSES_NOT_FOUND, nil)
	}
	return u.expRepo.Delete(ctx, expID)
}

func (u *ExpensesUseCase) UpdateExpenses(ctx context.Context, exp *domain.Expenses) error {
	detail, err := u.expRepo.GetByID(ctx, exp.ID)
	if err != nil {
		return errors.New(err.Error())
	}
	if detail.UserID != exp.UserID {
		return errors.New(constants.TRANSACTION_NOT_FOUND)
	}
	if exp.Title == "" {
		return errors.New(constants.TITLE_REQUIRED)
	}
	if exp.Amount <= 0 {
		return errors.New(constants.AMOUNT_REQUIRED)
	}
	return u.expRepo.Update(ctx, exp)
}

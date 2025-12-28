package usecase

import (
	"context"
	"errors"
	"financial-health/internal/constants"
	"financial-health/internal/domain"
)

type TransactionUseCase struct {
	trxRepo  domain.TransactionRepository
	loanRepo domain.LoanRepository
}

func NewTransactionUseCase(trxRepo domain.TransactionRepository, loanRepo domain.LoanRepository) domain.TransactionUseCase {
	return &TransactionUseCase{
		trxRepo:  trxRepo,
		loanRepo: loanRepo,
	}
}

func (u *TransactionUseCase) CreateTransaction(ctx context.Context, trx *domain.Transaction) error {
	if trx.TransactionDate == "" {
		return errors.New(constants.TRANSACTION_DATE_REQUIRED)
	}
	if trx.Type == "loan_payment" {
		if trx.ReferenceID == 0 {
			return errors.New(constants.REFERENCE_ID_REQUIRED)
		}
		detail, err := u.loanRepo.GetDetailByID(ctx, trx.ReferenceID)
		if err != nil {
			return err
		}

		parentLoan, err := u.loanRepo.GetLoanByID(ctx, detail.LoanID)

		if err != nil {
			return errors.New("invalid loan detail reference")
		}

		if detail.Status == "paid" {
			return errors.New("installment is already paid")
		}

		if parentLoan.UserID != trx.UserID {
			return errors.New("installment not found")
		}

		trx.Amount = detail.Amount
		if err := u.loanRepo.UpdateDetailStatus(ctx, detail.ID, "paid"); err != nil {
			return err
		}

		newAmountDue := parentLoan.AmountDue - trx.Amount
		loanStatus := "on_going"
		if newAmountDue <= 0 {
			loanStatus = "settled"
			newAmountDue = 0
		}
		if err := u.loanRepo.UpdateLoanStatusAndDue(ctx, parentLoan.ID, trx.Amount, loanStatus); err != nil {
			return err
		}
	}
	if trx.Type == "debit" || trx.Type == "credit" || trx.Type == "saving" {
		if trx.ReferenceID != 0 {
			return errors.New(constants.REFERENCE_ID_NONREQUIRED)
		}
		if trx.Amount <= 0 {
			return errors.New(constants.AMOUNT_REQUIRED)
		}
	}
	return u.trxRepo.Create(ctx, trx)
}

func (u *TransactionUseCase) GetAllTransaction(ctx context.Context, userID int64, page, limit int, sortBy, sortType, query, tipe, startDate, endDate string) (*domain.RowsList[domain.Transaction], error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}

	transactions, total, err := u.trxRepo.GetAll(ctx, userID, page, limit, sortBy, sortType, query, tipe, startDate, endDate)
	if err != nil {
		return nil, err
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	return &domain.RowsList[domain.Transaction]{
		Rows:       transactions,
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}, nil
}

func (u *TransactionUseCase) DeleteTransaction(ctx context.Context, userID, trxID int64) (string, error) {
	detail, err := u.trxRepo.GetByID(ctx, trxID)
	if err != nil {
		return "", err
	}
	if detail.UserID != userID {
		return "", errors.New(constants.TRANSACTION_NOT_FOUND)
	}
	return u.trxRepo.Delete(ctx, trxID)
}

func (u *TransactionUseCase) UpdateTransaction(ctx context.Context, trx *domain.Transaction) error {
	detail, err := u.trxRepo.GetByID(ctx, trx.ID)
	if err != nil {
		return errors.New(err.Error())
	}
	if detail.UserID != trx.UserID {
		return errors.New(constants.TRANSACTION_NOT_FOUND)
	}
	if trx.Type == "debit" || trx.Type == "credit" {
		if trx.TransactionDate == "" {
			return errors.New(constants.TRANSACTION_DATE_REQUIRED)
		}
		if trx.ReferenceID != 0 {
			return errors.New(constants.REFERENCE_ID_NONREQUIRED)
		}
		if trx.Amount <= 0 {
			return errors.New(constants.AMOUNT_REQUIRED)
		}
	} else {
		return errors.New("transaction type must credit/debit")
	}
	return u.trxRepo.Update(ctx, trx)
}

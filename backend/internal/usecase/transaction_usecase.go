package usecase

import (
	"context"
	"errors"
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
	if trx.Type == "loan_payment" {
		detail, err := u.loanRepo.GetDetailByID(ctx, trx.ReferenceID)
		if err != nil {
			return err
		}

		parentLoan, err := u.loanRepo.GetLoanByID(ctx, detail.LoanID)

		if err != nil {
			return errors.New("invalid loan detail reference")
		}

		if detail.Status == "paid" {
			return errors.New("this installment is already paid")
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
	if trx.Type == "debit" || trx.Type == "credit" {
		if trx.ReferenceID != 0 {
			return errors.New("reference id cannot be filled")
		}
		if trx.Amount <= 0 {
			return errors.New("amount must more than zero")
		}
	}
	return u.trxRepo.Create(ctx, trx)
}

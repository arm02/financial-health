package usecase

import (
	"context"
	"errors"
	"financial-health/internal/constants"
	"financial-health/internal/domain"
	"fmt"
	"log"
	"time"
)

type LoanUseCase struct {
	loanRepo       domain.LoanRepository
	contextTimeout time.Duration
}

func NewLoanUseCase(repo domain.LoanRepository) domain.LoanUseCase {
	return &LoanUseCase{
		loanRepo:       repo,
		contextTimeout: time.Second * 3,
	}
}

func (u *LoanUseCase) CreateLoan(ctx context.Context, loan *domain.Loan) error {
	loan.TotalAmount = loan.Amount * float64(loan.Tenor)
	loan.AmountDue = loan.TotalAmount
	loan.Status = "on_going"

	id, err := u.loanRepo.Create(ctx, loan)
	if err != nil {
		return err
	}
	loan.ID = id

	go func(l domain.Loan) {
		bgCtx := context.Background()
		layout := "2006-01-02"
		startDate, err := time.Parse(layout, l.StartDate)
		if err != nil {
			log.Printf("Error parsing date in goroutine: %v", err)
			return
		}

		for i := 1; i <= l.Tenor; i++ {
			var dueDate time.Time
			switch l.TenorType {
			case "weekly":
				dueDate = startDate.AddDate(0, 0, 7*i)
			case "monthly":
				dueDate = startDate.AddDate(0, i, 0)
			case "yearly":
				dueDate = startDate.AddDate(i, 0, 0)
			default:
				dueDate = startDate.AddDate(0, 1, 0)
			}

			detail := domain.LoanDetail{
				LoanID:      l.ID,
				CycleNumber: i,
				Amount:      l.Amount,
				DueDate:     dueDate.Format(layout),
				Status:      "unpaid",
			}

			if err := u.loanRepo.CreateDetail(bgCtx, &detail); err != nil {
				log.Printf("Failed to generate loan detail cycle %d for loan %d: %v", i, l.ID, err)
			}
		}
		fmt.Printf("Successfully generated %d loan details for Loan ID %d\n", l.Tenor, l.ID)
	}(*loan)

	return nil
}

func (u *LoanUseCase) GetAllLoans(ctx context.Context, userID int64, page, limit int, sortBy, sortType, query string) (*domain.RowsList[domain.Loan], error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}

	loans, total, err := u.loanRepo.GetAll(ctx, userID, page, limit, sortBy, sortType, query)
	if err != nil {
		return nil, err
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	return &domain.RowsList[domain.Loan]{
		Rows:       loans,
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}, nil
}

func (u *LoanUseCase) GetLoan(ctx context.Context, loanID int64) (*domain.Loan, error) {
	return u.loanRepo.GetLoanByID(ctx, loanID)
}

func (u *LoanUseCase) GetLoanDetails(ctx context.Context, userID, loanID int64, page, limit int, sortBy, sortType string) (*domain.RowsList[domain.LoanDetail], error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}

	parentLoan, err := u.loanRepo.GetLoanByID(ctx, loanID)
	if err != nil {
		return nil, err
	}

	if userID != parentLoan.UserID {
		return nil, errors.New("installment not found")
	}

	loans, total, err := u.loanRepo.GetDetailsByLoanID(ctx, loanID, page, limit, sortBy, sortType)
	if err != nil {
		return nil, err
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	return &domain.RowsList[domain.LoanDetail]{
		Rows:       loans,
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}, nil
}

func (u *LoanUseCase) DeleteLoan(ctx context.Context, userID, loanID int64) error {
	detail, err := u.loanRepo.GetLoanByID(ctx, loanID)
	if err != nil {
		return errors.New(constants.LOAN_NOT_FOUND)
	}
	if detail.UserID != userID {
		return errors.New(constants.LOAN_NOT_FOUND)
	}
	return u.loanRepo.Delete(ctx, loanID)
}

func (u *LoanUseCase) GetPaymentHistory(ctx context.Context, userID, loanID int64, page, limit int) (*domain.RowsList[domain.LoanPaymentHistory], error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}

	parentLoan, err := u.loanRepo.GetLoanByID(ctx, loanID)
	if err != nil {
		return nil, errors.New(constants.LOAN_NOT_FOUND)
	}

	if userID != parentLoan.UserID {
		return nil, errors.New(constants.LOAN_NOT_FOUND)
	}

	history, total, err := u.loanRepo.GetPaymentHistory(ctx, loanID, page, limit)
	if err != nil {
		return nil, err
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	return &domain.RowsList[domain.LoanPaymentHistory]{
		Rows:       history,
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}, nil
}

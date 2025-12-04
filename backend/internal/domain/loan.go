package domain

import (
	"context"
	"time"
)

type Loan struct {
	ID          int64     `json:"id"`
	UserID      int64     `json:"user_id"`
	Title       string    `json:"title"`
	Tenor       int       `json:"tenor"`
	TenorType   string    `json:"tenor_type"` // weekly, monthly, yearly
	Amount      float64   `json:"amount"`     // Installment amount
	AmountDue   float64   `json:"amount_due"`
	TotalAmount float64   `json:"total_amount"`
	StartDate   string    `json:"start_date"` // YYYY-MM-DD
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
}

type LoanDetail struct {
	ID          int64   `json:"id"`
	LoanID      int64   `json:"loan_id"`
	CycleNumber int     `json:"cycle_number"`
	Amount      float64 `json:"amount"`
	DueDate     string  `json:"due_date"`
	Status      string  `json:"status"`
}

type LoanList struct {
	Rows       []Loan `json:"rows"`
	Page       int    `json:"page"`
	Limit      int    `json:"limit"`
	Total      int64  `json:"total"`
	TotalPages int64  `json:"total_pages"`
}

type LoanUseCase interface {
	CreateLoan(ctx context.Context, loan *Loan) error
	GetAllLoans(ctx context.Context, userID int64, page, limit int) (*LoanList, error)
	GetLoan(ctx context.Context, loanID int64) (*Loan, error)
	GetLoanDetails(ctx context.Context, loanID int64) ([]LoanDetail, error)
}

type LoanRepository interface {
	Create(ctx context.Context, loan *Loan) (int64, error)
	CreateDetail(ctx context.Context, detail *LoanDetail) error
	GetAll(ctx context.Context, userID int64, page, limit int) ([]Loan, int64, error)
	GetLoanByID(ctx context.Context, id int64) (*Loan, error)
	GetDetailByID(ctx context.Context, id int64) (*LoanDetail, error)
	UpdateLoanStatusAndDue(ctx context.Context, loanID int64, amountPaid float64, status string) error
	UpdateDetailStatus(ctx context.Context, detailID int64, status string) error
	GetDetailsByLoanID(ctx context.Context, loanID int64) ([]LoanDetail, error)
}

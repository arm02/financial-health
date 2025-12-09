package repository

import (
	"context"
	"database/sql"
	"financial-health/internal/domain"
	"financial-health/internal/utils"
	"fmt"
	"strings"
)

type LoanRepositoryImpl struct {
	db *sql.DB
}

func NewLoanRepository(db *sql.DB) domain.LoanRepository {
	return &LoanRepositoryImpl{db}
}

func (r *LoanRepositoryImpl) Create(ctx context.Context, loan *domain.Loan) (int64, error) {
	query := `INSERT INTO loans (user_id, title, tenor, tenor_type, amount, amount_due, total_amount, start_date, status) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	res, err := r.db.ExecContext(ctx, query, loan.UserID, loan.Title, loan.Tenor, loan.TenorType, loan.Amount, loan.AmountDue, loan.TotalAmount, loan.StartDate, loan.Status)
	if err != nil {
		return 0, utils.NewSystemError("Database error", err)
	}
	return res.LastInsertId()
}

func (r *LoanRepositoryImpl) CreateDetail(ctx context.Context, detail *domain.LoanDetail) error {
	query := `INSERT INTO loan_details (loan_id, cycle_number, amount, due_date, status) VALUES (?, ?, ?, ?, ?)`
	_, err := r.db.ExecContext(ctx, query, detail.LoanID, detail.CycleNumber, detail.Amount, detail.DueDate, detail.Status)
	return err
}

func (r *LoanRepositoryImpl) GetAll(ctx context.Context, userID int64, page, limit int, sortBy, sortType, searchTitle string) ([]domain.Loan, int64, error) {
	offset := (page - 1) * limit

	allowedSortColumns := map[string]bool{
		"created_at": true,
		"amount":     true,
		"amount_due": true,
		"tenor":      true,
		"start_date": true,
		"title":      true,
		"status":     true,
	}
	if !allowedSortColumns[sortBy] {
		sortBy = "created_at"
	}

	sortType = strings.ToUpper(sortType)
	if sortType != "ASC" && sortType != "DESC" {
		sortType = "DESC"
	}

	query := `
        SELECT id, user_id, title, tenor, tenor_type, amount, amount_due, total_amount, start_date, status
        FROM loans
        WHERE user_id = ?`

	args := []interface{}{userID}

	if searchTitle != "" {
		query += " AND title LIKE ?"
		args = append(args, "%"+searchTitle+"%")
	}

	query += fmt.Sprintf(" ORDER BY %s %s LIMIT ? OFFSET ?", sortBy, sortType)
	args = append(args, limit, offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var loans []domain.Loan
	for rows.Next() {
		var l domain.Loan
		if err := rows.Scan(
			&l.ID, &l.UserID, &l.Title, &l.Tenor, &l.TenorType,
			&l.Amount, &l.AmountDue, &l.TotalAmount, &l.StartDate, &l.Status,
		); err != nil {
			return nil, 0, err
		}
		loans = append(loans, l)
	}

	countQuery := "SELECT COUNT(*) FROM loans WHERE user_id = ?"
	countArgs := []interface{}{userID}
	if searchTitle != "" {
		countQuery += " AND title LIKE ?"
		countArgs = append(countArgs, "%"+searchTitle+"%")
	}

	var total int64
	err = r.db.QueryRowContext(ctx, countQuery, countArgs...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	return loans, total, nil
}

func (r *LoanRepositoryImpl) GetLoanByID(ctx context.Context, id int64) (*domain.Loan, error) {
	query := `SELECT id, user_id, title, tenor, tenor_type, amount, amount_due, total_amount, start_date, status FROM loans WHERE id = ?`
	row := r.db.QueryRowContext(ctx, query, id)

	var l domain.Loan
	if err := row.Scan(&l.ID, &l.UserID, &l.Title, &l.Tenor, &l.TenorType, &l.Amount, &l.AmountDue, &l.TotalAmount, &l.StartDate, &l.Status); err != nil {
		return nil, err
	}
	return &l, nil
}

func (r *LoanRepositoryImpl) GetDetailByID(ctx context.Context, id int64) (*domain.LoanDetail, error) {
	query := `SELECT id, loan_id, cycle_number, amount, due_date, status FROM loan_details WHERE id = ?`
	row := r.db.QueryRowContext(ctx, query, id)

	var d domain.LoanDetail
	if err := row.Scan(&d.ID, &d.LoanID, &d.CycleNumber, &d.Amount, &d.DueDate, &d.Status); err != nil {
		return nil, utils.NewSystemError("Database error", err)
	}
	return &d, nil
}

func (r *LoanRepositoryImpl) UpdateLoanStatusAndDue(ctx context.Context, loanID int64, amountPaid float64, status string) error {
	query := `UPDATE loans SET amount_due = amount_due - ?, status = ? WHERE id = ?`
	_, err := r.db.ExecContext(ctx, query, amountPaid, status, loanID)
	return err
}

func (r *LoanRepositoryImpl) UpdateDetailStatus(ctx context.Context, detailID int64, status string) error {
	query := `UPDATE loan_details SET status = ? WHERE id = ?`
	_, err := r.db.ExecContext(ctx, query, status, detailID)
	return err
}

func (r *LoanRepositoryImpl) GetDetailsByLoanID(ctx context.Context, loanID int64, page, limit int, sortBy, sortType string) ([]domain.LoanDetail, int64, error) {
	offset := (page - 1) * limit

	allowedSortColumns := map[string]bool{
		"cycle_number": true,
		"amount":       true,
		"due_date":     true,
		"status":       true,
	}
	if !allowedSortColumns[sortBy] {
		sortBy = "cycle_number"
	}

	sortType = strings.ToUpper(sortType)
	if sortType != "ASC" && sortType != "DESC" {
		sortType = "DESC"
	}

	query := `SELECT id, loan_id, cycle_number, amount, due_date, status FROM loan_details WHERE loan_id = ?`

	args := []interface{}{loanID}

	query += fmt.Sprintf(" ORDER BY %s %s LIMIT ? OFFSET ?", sortBy, sortType)
	args = append(args, limit, offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var loans []domain.LoanDetail
	for rows.Next() {
		var l domain.LoanDetail
		if err := rows.Scan(
			&l.ID, &l.LoanID, &l.CycleNumber, &l.Amount, &l.DueDate, &l.Status,
		); err != nil {
			return nil, 0, err
		}
		loans = append(loans, l)
	}

	countQuery := "SELECT COUNT(*) FROM loan_details WHERE loan_id = ?"
	countArgs := []interface{}{loanID}

	var total int64
	err = r.db.QueryRowContext(ctx, countQuery, countArgs...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	return loans, total, nil
}

func (r *LoanRepositoryImpl) Delete(ctx context.Context, loanID int64) error {
	query := "DELETE FROM loans WHERE id = ?"
	_, err := r.db.ExecContext(ctx, query, loanID)
	if err != nil {
		return err
	}
	return nil
}

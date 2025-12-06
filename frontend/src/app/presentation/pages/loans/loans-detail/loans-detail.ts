import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TableLocal } from '../../../../core/helpers/components/table';
import { TableColumn } from '../../../../data/collection/table.collection';
import { LOAN_DETAIL_TABLE_COLUMN } from '../../../../data/collection/loan.collections';
import { Subject, takeUntil } from 'rxjs';
import { LoanDetail, LoanDetailResponse } from '../../../../core/domain/entities/loan.entities';
import { GetDetailLoanUseCase } from '../../../../core/usecase/loans/get-loan-detail.usecase';

@Component({
  selector: 'app-loans-detail',
  standalone: true,
  imports: [CommonModule, TableLocal],
  templateUrl: './loans-detail.html',
  styleUrl: './loans-detail.scss',
})
export class LoansDetail implements OnInit {
  private destroy$ = new Subject<void>();
  readonly dialogRef = inject(MatDialogRef<LoansDetail>);
  readonly loan = inject<any>(MAT_DIALOG_DATA);
  protected loader = signal(false);
  private getLoanDetailUseCase = inject(GetDetailLoanUseCase);

  cols: TableColumn[] = structuredClone(LOAN_DETAIL_TABLE_COLUMN);
  rows: LoanDetail[] = [];

  ngOnInit(): void {
    this.GetDetailLoan();
  }

  GetDetailLoan() {
    this.getLoanDetailUseCase
      .execute(this.loan.data.data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: LoanDetailResponse) => {
          this.rows = res.data;
        },
      });
  }

  getStatusClass(status: string) {
    return {
      PAID: 'badge-success',
      PENDING: 'badge-warning',
      LATE: 'badge-danger',
    }[status];
  }
}

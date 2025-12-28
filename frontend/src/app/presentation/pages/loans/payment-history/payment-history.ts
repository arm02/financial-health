import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import {
  LoanPaymentHistory,
  LoanPaymentHistoryResponse,
} from '../../../../core/domain/entities/loan.entities';
import { GetPaymentHistoryUseCase } from '../../../../core/usecase/loans/get-payment-history.usecase';
import { DefaultParams } from '../../../../core/domain/dto/base.dto';
import { LoaderBarLocal } from '../../../../core/helpers/components/loader';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, MatIconModule, LoaderBarLocal],
  templateUrl: './payment-history.html',
  styleUrl: './payment-history.scss',
})
export class PaymentHistoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  readonly dialogRef = inject(MatDialogRef<PaymentHistoryComponent>);
  readonly loan = inject<any>(MAT_DIALOG_DATA);
  protected loader = signal(false);
  private getPaymentHistoryUseCase = inject(GetPaymentHistoryUseCase);

  params: DefaultParams = {
    page: 1,
    limit: 10,
  };

  rows: LoanPaymentHistory[] = [];
  totalRows = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.getPaymentHistory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getPaymentHistory(): void {
    this.loader.set(true);
    this.getPaymentHistoryUseCase
      .execute({ loanID: this.loan.data.data.id, params: this.params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: LoanPaymentHistoryResponse) => {
          this.rows = res.data.rows || [];
          this.totalRows = res.data.total;
          this.totalPages = res.data.total_pages;
          this.loader.set(false);
        },
        error: () => {
          this.loader.set(false);
        },
      });
  }

  onPageChange(page: number): void {
    this.params.page = page;
    this.getPaymentHistory();
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  formatCurrency(amount: number): string {
    return `Rp${amount.toLocaleString('id-ID')}`;
  }

  close(): void {
    this.dialogRef.close();
  }
}

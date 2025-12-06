import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TableLocal } from '../../../../core/helpers/components/table';
import { SortTable, TableColumn } from '../../../../data/collection/table.collection';
import { LOAN_DETAIL_TABLE_COLUMN } from '../../../../data/collection/loan.collections';
import { Subject, takeUntil } from 'rxjs';
import { LoanDetail, LoanDetailResponse } from '../../../../core/domain/entities/loan.entities';
import { GetDetailLoanUseCase } from '../../../../core/usecase/loans/get-loan-detail.usecase';
import { DefaultParams } from '../../../../core/domain/dto/base.dto';

@Component({
  selector: 'app-loans-detail',
  standalone: true,
  imports: [CommonModule, TableLocal],
  templateUrl: './loans-detail.html',
  styleUrl: './loans-detail.scss',
})
export class LoansDetail implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  readonly dialogRef = inject(MatDialogRef<LoansDetail>);
  readonly loan = inject<any>(MAT_DIALOG_DATA);
  protected loader = signal(false);
  private getLoanDetailUseCase = inject(GetDetailLoanUseCase);
  params: DefaultParams = {
    page: 1,
    limit: 3,
  };

  cols: TableColumn[] = structuredClone(LOAN_DETAIL_TABLE_COLUMN);
  rows: LoanDetail[] = [];
  totalRows = 0;

  ngOnInit(): void {
    this.GetDetailLoan();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  GetDetailLoan() {
    this.loader.set(true);
    this.getLoanDetailUseCase
      .execute({ loanID: this.loan.data.data.id, params: this.params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: LoanDetailResponse) => {
          this.rows = res.data.rows;
          this.totalRows = res.data.total;
          this.loader.set(false);
        },
        error: () => {
          this.loader.set(false);
        },
      });
  }

  OnTableChange(type: string, payload: any) {
    const handlers: Record<string, { fn: () => void; reload: boolean }> = {
      sort: { fn: () => this.onSort(payload), reload: true },
      page: { fn: () => this.onPageChange(payload), reload: true },
    };
    const handler = handlers[type];
    if (handler) {
      handler.fn();
      if (handler.reload) this.GetDetailLoan();
    }
  }

  onSort($event: SortTable) {
    this.params.sort_by = $event.sortBy;
    this.params.sort_type = $event.sortType;
  }

  onPageChange($event: number) {
    this.params.page = $event;
  }
}

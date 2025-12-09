import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TableLocal } from '../../../../core/helpers/components/table';
import {
  LOAN_DETAIL_CONTEXT_MENU,
  LOAN_DETAIL_TABLE_COLUMN,
} from '../../../../data/collection/loan.collections';
import { Subject, takeUntil } from 'rxjs';
import {
  Loan,
  LoanDetail,
  LoanDetailResponse,
} from '../../../../core/domain/entities/loan.entities';
import { GetDetailLoanUseCase } from '../../../../core/usecase/loans/get-loan-detail.usecase';
import { DefaultParams } from '../../../../core/domain/dto/base.dto';
import {
  ContextAction,
  SortTable,
  TableColumn,
} from '../../../../core/domain/entities/table.entities';
import { DialogService } from '../../../../core/helpers/services/dialog.service';
import { CreateTransactionUseCase } from '../../../../core/usecase/transactions/create-transaction.usecase';
import { CreateTransactionDTO } from '../../../../core/domain/dto/transaction.dto';
import { DateService } from '../../../../core/helpers/services/date.service';

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
  private dialogService = inject(DialogService);
  private dateService = inject(DateService);
  private getLoanDetailUseCase = inject(GetDetailLoanUseCase);
  private createTransactionUseCase = inject(CreateTransactionUseCase);
  params: DefaultParams = {
    page: 1,
    limit: 3,
  };

  cols: TableColumn[] = structuredClone(LOAN_DETAIL_TABLE_COLUMN);
  contextMenu: ContextAction[] = structuredClone(LOAN_DETAIL_CONTEXT_MENU);
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

  PayLoan(loan: LoanDetail) {
    this.loader.set(false);
    const params: CreateTransactionDTO = {
      title: `Pay Installment For ${this.loan.data.data.title} - ${loan.cycle_number}`,
      type: 'loan_payment',
      reference_id: loan.id,
      transaction_date: this.dateService.TransformDateFormat(new Date()),
    };
    this.createTransactionUseCase
      .execute(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.GetDetailLoan();
          this.loader.set(false);
        },
      });
  }

  OnHandleContext(e: { action: string; row: LoanDetail }) {
    const handlers: Record<string, { fn: () => void; reload: boolean }> = {
      pay: { fn: () => this.onPayLoan(e.row), reload: false },
    };
    const handler = handlers[e.action];
    if (handler) {
      handler.fn();
      if (handler.reload) this.GetDetailLoan();
    }
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

  onPayLoan(loan: LoanDetail) {
    this.dialogService
      .Confirmation()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: boolean) => {
          if (res) this.PayLoan(loan);
        },
      });
  }

  onSort($event: SortTable) {
    this.params.sort_by = $event.sortBy;
    this.params.sort_type = $event.sortType;
  }

  onPageChange($event: number) {
    this.rows = [];
    this.params.page = $event;
  }
}

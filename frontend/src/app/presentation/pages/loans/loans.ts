import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { TableLocal } from '../../../core/helpers/components/table';
import { GetAllLoanUseCase } from '../../../core/usecase/loans/get-all-loan.usecase';
import { DefaultParams } from '../../../core/domain/dto/base.dto';
import { Subject, takeUntil } from 'rxjs';
import { Loan, LoanResponse } from '../../../core/domain/entities/loan.entities';
import { DialogService } from '../../../core/helpers/services/dialog.service';
import { LoansForm } from './loans-form/loans-form';
import { LOAN_CONTEXT_MENU, LOAN_TABLE_COLUMN } from '../../../data/collection/loan.collections';
import { CreateLoanDTO } from '../../../core/domain/dto/loan.dto';
import { CreateLoanUseCase } from '../../../core/usecase/loans/create-loan.usecase';
import { LoansDetail } from './loans-detail/loans-detail';
import {
  ContextAction,
  SortTable,
  TableColumn,
} from '../../../core/domain/entities/table.entities';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [TableLocal],
  templateUrl: './loans.html',
  styleUrl: './loans.scss',
})
export class LoansComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private getAllLoanUseCase = inject(GetAllLoanUseCase);
  private createLoanUseCase = inject(CreateLoanUseCase);
  private dialogService = inject(DialogService);
  protected loader = signal(false);
  params: DefaultParams = {
    page: 1,
    limit: 10,
  };

  cols: TableColumn[] = structuredClone(LOAN_TABLE_COLUMN);
  contextMenu: ContextAction[] = structuredClone(LOAN_CONTEXT_MENU);

  rows: Loan[] = [];
  totalRows = 0;

  ngOnInit(): void {
    this.GetAllLoan();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  GetAllLoan() {
    this.loader.set(true);
    this.getAllLoanUseCase
      .execute(this.params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: LoanResponse) => {
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
      search: { fn: () => this.onSearch(payload), reload: true },
      page: { fn: () => this.onPageChange(payload), reload: true },
      create: { fn: () => this.onCreate(), reload: false },
    };
    const handler = handlers[type];
    if (handler) {
      handler.fn();
      if (handler.reload) this.GetAllLoan();
    }
  }

  OnHandleContext(e: { action: string; row: any }) {
    const handlers: Record<string, { fn: () => void; reload: boolean }> = {
      detail: { fn: () => this.onDetail(e.row), reload: true },
    };
    const handler = handlers[e.action];
    if (handler) {
      handler.fn();
      if (handler.reload) this.GetAllLoan();
    }
  }

  onCreate() {
    this.dialogService
      .Open(LoansForm, { title: 'Create New Loan', width: '550px' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CreateLoanDTO) => {
          if (res) this.onCreateAction(res);
        },
      });
  }

  onCreateAction(body: CreateLoanDTO) {
    this.loader.set(true);
    this.createLoanUseCase
      .execute(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.GetAllLoan();
        },
      });
  }

  onDetail(params: Loan) {
    this.dialogService
      .Open(LoansDetail, { title: 'Detail Loan', data: params, width: '1000px' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {},
      });
  }

  onSort($event: SortTable) {
    this.params.sort_by = $event.sortBy;
    this.params.sort_type = $event.sortType;
  }

  onSearch($event: string) {
    this.params.query = $event;
  }

  onPageChange($event: number) {
    this.rows = [];
    this.params.page = $event;
  }
}

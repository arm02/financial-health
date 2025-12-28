import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from '../../../core/helpers/services/dialog.service';
import { DefaultParams } from '../../../core/domain/dto/base.dto';
import {
  TRANSACTION_CONTEXT_MENU,
  TRANSACTION_TABLE_COLUMN,
} from '../../../data/collection/transaction.collection';
import {
  Transaction,
  TransactionCreateResponse,
  TransactionDeleteResponse,
  TransactionResponse,
} from '../../../core/domain/entities/transaction.entities';
import { GetAllTransactionUseCase } from '../../../core/usecase/transactions/get-all-transaction.usecase';
import { TransactionForm } from './transaction-form/transaction-form';
import { DateRangeFilter, TableLocal } from '../../../core/helpers/components/table';
import { CreateTransactionDTO } from '../../../core/domain/dto/transaction.dto';
import { CreateTransactionUseCase } from '../../../core/usecase/transactions/create-transaction.usecase';
import { DeleteTransactionUseCase } from '../../../core/usecase/transactions/delete-transaction.usecase';
import {
  ContextAction,
  SortTable,
  TableColumn,
} from '../../../core/domain/entities/table.entities';
import { SnackbarService } from '../../../core/helpers/components/snackbar.service';
import { UpdateRequest } from '../../../core/domain/entities/http.entities';
import { UpdateTransactionUseCase } from '../../../core/usecase/transactions/update-transaction.usecase';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [TableLocal],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class TransactionsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private getAllTransactionUseCase = inject(GetAllTransactionUseCase);
  private createTransactionUseCase = inject(CreateTransactionUseCase);
  private updateTransactionUseCase = inject(UpdateTransactionUseCase);
  private deleteTransactionUseCase = inject(DeleteTransactionUseCase);
  private dialogService = inject(DialogService);
  private snackbar = inject(SnackbarService);
  protected loader = signal(false);
  params: DefaultParams = {
    page: 1,
    limit: 10,
    tipe: 'debit,credit,loan_payment',
  };

  cols: TableColumn[] = structuredClone(TRANSACTION_TABLE_COLUMN);
  contextMenu: ContextAction[] = structuredClone(TRANSACTION_CONTEXT_MENU);

  rows: Transaction[] = [];
  totalRows = 0;

  ngOnInit(): void {
    this.GetAllTransaction();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  GetAllTransaction(): void {
    this.loader.set(true);
    this.getAllTransactionUseCase
      .execute(this.params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: TransactionResponse) => {
          this.rows = res.data.rows;
          this.totalRows = res.data.total;
          this.loader.set(false);
        },
        error: () => {
          this.loader.set(false);
        },
      });
  }

  OnTableChange(type: string, payload: any): void {
    const handlers: Record<string, { fn: () => void; reload: boolean }> = {
      sort: { fn: () => this.onSort(payload), reload: true },
      search: { fn: () => this.onSearch(payload), reload: true },
      page: { fn: () => this.onPageChange(payload), reload: true },
      create: { fn: () => this.onCreate(), reload: false },
      simplecreate: { fn: () => this.onCreateSimple(), reload: false },
      datefilter: { fn: () => this.onDateFilter(payload), reload: true },
    };
    const handler = handlers[type];
    if (handler) {
      handler.fn();
      if (handler.reload) this.GetAllTransaction();
    }
  }

  onDateFilter($event: DateRangeFilter): void {
    this.params.start_date = $event.startDate;
    this.params.end_date = $event.endDate;
  }

  OnHandleContext(e: { action: string; row: Transaction }): void {
    const handlers: Record<string, { fn: () => void }> = {
      edit: { fn: () => this.onEdit(e.row) },
      delete: { fn: () => this.onDelete(e.row) },
    };
    const handler = handlers[e.action];
    if (handler) {
      handler.fn();
    }
  }

  onCreate(): void {
    this.dialogService
      .Open(TransactionForm, {
        title: 'Create New Transaction',
        data: { mode: 'normal' },
        width: '550px',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CreateTransactionDTO) => {
          if (res) this.onCreateAction(res);
        },
      });
  }

  onCreateSimple(): void {
    this.dialogService
      .Open(TransactionForm, {
        title: 'Create New Transaction',
        data: { mode: 'simple' },
        width: '550px',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CreateTransactionDTO) => {
          if (res) this.onCreateAction(res);
        },
      });
  }

  onCreateAction(body: CreateTransactionDTO): void {
    this.loader.set(true);
    this.createTransactionUseCase
      .execute(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: TransactionCreateResponse) => {
          if (res.message) {
            this.snackbar.show(res.message, 'SUCCESS');
          }
          this.GetAllTransaction();
        },
      });
  }

  onEdit(row: Transaction): void {
    this.dialogService
      .Open(TransactionForm, {
        title: 'Edit Transaction',
        data: { mode: 'normal', transaction: row },
        width: '550px',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CreateTransactionDTO) => {
          if (res) this.onUpdateAction({ id: row.id, data: res });
        },
      });
  }

  onUpdateAction(body: UpdateRequest<CreateTransactionDTO>): void {
    this.loader.set(true);
    this.updateTransactionUseCase
      .execute(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: TransactionCreateResponse) => {
          if (res.message) {
            this.snackbar.show(res.message, 'SUCCESS');
          }
          this.GetAllTransaction();
        },
      });
  }

  onDelete(row: Transaction): void {
    this.dialogService
      .Confirmation({
        title: 'Delete Transaction',
        message: `Are you sure you want to delete "${row.title}"?`,
        btnConfirm: 'Delete',
        btnCancel: 'Cancel',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (confirmed: boolean) => {
          if (confirmed) this.onDeleteAction(row.id);
        },
      });
  }

  onDeleteAction(id: number): void {
    this.loader.set(true);
    this.deleteTransactionUseCase
      .execute(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: TransactionDeleteResponse) => {
          if (res.message) {
            this.snackbar.show(res.message, 'SUCCESS');
          }
          this.GetAllTransaction();
        },
        error: () => {
          this.loader.set(false);
        },
      });
  }

  onSort($event: SortTable): void {
    this.params.sort_by = $event.sortBy;
    this.params.sort_type = $event.sortType;
  }

  onSearch($event: string): void {
    this.params.query = $event;
  }

  onPageChange($event: number): void {
    this.rows = [];
    this.params.page = $event;
  }
}

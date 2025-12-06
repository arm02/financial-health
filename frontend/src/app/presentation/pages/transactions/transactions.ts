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
  TransactionResponse,
} from '../../../core/domain/entities/transaction.entities';
import { GetAllTransactionUseCase } from '../../../core/usecase/transactions/get-all-transaction.usecase';
import { TransactionForm } from './transaction-form/transaction-form';
import { TableLocal } from '../../../core/helpers/components/table';
import { CreateTransactionDTO } from '../../../core/domain/dto/transaction.dto';
import { CreateTransactionUseCase } from '../../../core/usecase/transactions/create-transaction.usecase';
import {
  ContextAction,
  SortTable,
  TableColumn,
} from '../../../core/domain/entities/table.entities';

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
  private dialogService = inject(DialogService);
  protected loader = signal(false);
  params: DefaultParams = {
    page: 1,
    limit: 10,
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

  GetAllTransaction() {
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

  OnTableChange(type: string, payload: any) {
    const handlers: Record<string, { fn: () => void; reload: boolean }> = {
      sort: { fn: () => this.onSort(payload), reload: true },
      search: { fn: () => this.onSearch(payload), reload: true },
      page: { fn: () => this.onPageChange(payload), reload: true },
      create: { fn: () => this.onCreate(), reload: false },
      simplecreate: { fn: () => this.onCreateSimple(), reload: false },
    };
    const handler = handlers[type];
    if (handler) {
      handler.fn();
      if (handler.reload) this.GetAllTransaction();
    }
  }

  OnHandleContext(e: { action: string; row: any }) {
    const handlers: Record<string, { fn: () => void; reload: boolean }> = {};
    const handler = handlers[e.action];
    if (handler) {
      handler.fn();
      if (handler.reload) this.GetAllTransaction();
    }
  }

  onCreate() {
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

  onCreateSimple() {
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

  onCreateAction(body: CreateTransactionDTO) {
    this.loader.set(true);
    this.createTransactionUseCase
      .execute(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.GetAllTransaction();
        },
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

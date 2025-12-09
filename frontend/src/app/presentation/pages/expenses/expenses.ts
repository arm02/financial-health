import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from '../../../core/helpers/services/dialog.service';
import { DefaultParams } from '../../../core/domain/dto/base.dto';
import {
  EXPENSES_CONTEXT_MENU,
  EXPENSES_TABLE_COLUMN,
} from '../../../data/collection/expenses.collection';
import {
  Expenses,
  ExpensesCreateResponse,
  ExpensesResponse,
} from '../../../core/domain/entities/expenses.entities';
import { TableLocal } from '../../../core/helpers/components/table';
import { CreateExpensesDTO } from '../../../core/domain/dto/expenses.dto';
import {
  ContextAction,
  SortTable,
  TableColumn,
} from '../../../core/domain/entities/table.entities';
import { CreateExpensesUseCase } from '../../../core/usecase/expenses/create-expenses.usecase';
import { GetAllExpensesUseCase } from '../../../core/usecase/expenses/get-all-expenses.usecase';
import { ExpensesForm } from './expenses-form/expenses-form';
import { SnackbarService } from '../../../core/helpers/components/snackbar.service';
import { InformationDialogDTO } from '../../../core/domain/dto/dialog.dto';
import { InformationDialogComponent } from '../../../core/helpers/components/information-dialog';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [TableLocal],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss',
})
export class ExpensesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private getAllExpensesUseCase = inject(GetAllExpensesUseCase);
  private createExpensesUseCase = inject(CreateExpensesUseCase);
  private dialogService = inject(DialogService);
  private snackbar = inject(SnackbarService);

  protected loader = signal(false);
  params: DefaultParams = {
    page: 1,
    limit: 10,
  };

  cols: TableColumn[] = structuredClone(EXPENSES_TABLE_COLUMN);
  contextMenu: ContextAction[] = structuredClone(EXPENSES_CONTEXT_MENU);

  rows: Expenses[] = [];
  totalRows = 0;

  ngOnInit(): void {
    this.GetAllExpenses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  GetAllExpenses() {
    this.loader.set(true);
    this.getAllExpensesUseCase
      .execute(this.params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ExpensesResponse) => {
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
      if (handler.reload) this.GetAllExpenses();
    }
  }

  OnHandleContext(e: { action: string; row: any }) {
    const handlers: Record<string, { fn: () => void; reload: boolean }> = {};
    const handler = handlers[e.action];
    if (handler) {
      handler.fn();
      if (handler.reload) this.GetAllExpenses();
    }
  }

  openDialogInformation(title: string, subtitle: string, type: 'success' | 'failed') {
    const data: InformationDialogDTO = {
      icon: type === 'success' ? 'check_circle_outline' : 'cancel',
      iconClass: type === 'success' ? 'text-success' : 'text-danger',
      title,
      subtitle,
      submitButton: 'Done',
      submitClass: 'btn-primary',
    }
    this.dialogService
      .Open(InformationDialogComponent, {
        title: 'Create New Expenses',
        data,
        width: '400px',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log(res);
        },
      });
  }

  onCreate() {
    this.dialogService
      .Open(ExpensesForm, {
        title: 'Create New Expenses',
        data: { mode: 'normal' },
        width: '550px',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CreateExpensesDTO) => {
          if (res) this.onCreateAction(res);
        },
      });
  }

  onCreateSimple() {
    this.dialogService
      .Open(ExpensesForm, {
        title: 'Create New Expenses',
        data: { mode: 'simple' },
        width: '550px',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CreateExpensesDTO) => {
          if (res) this.onCreateAction(res);
        },
      });
  }

  onCreateAction(body: CreateExpensesDTO) {
    this.loader.set(true);
    this.createExpensesUseCase
      .execute(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ExpensesCreateResponse) => {
          if (res.message) {
            this.snackbar.show(res.message, 'SUCCESS');
            // this.openDialogInformation('Success!', res.message, 'success');
          }
          this.GetAllExpenses();
        },
        error: (err) => {
          this.openDialogInformation('Failed!', err.message, 'failed');
        }
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

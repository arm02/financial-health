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
  ExpensesDeleteResponse,
  ExpensesResponse,
} from '../../../core/domain/entities/expenses.entities';
import { DateRangeFilter, TableLocal } from '../../../core/helpers/components/table';
import { CreateExpensesDTO } from '../../../core/domain/dto/expenses.dto';
import {
  ContextAction,
  SortTable,
  TableColumn,
} from '../../../core/domain/entities/table.entities';
import { CreateExpensesUseCase } from '../../../core/usecase/expenses/create-expenses.usecase';
import { UpdateExpensesUseCase } from '../../../core/usecase/expenses/update-expenses.usecase';
import { DeleteExpensesUseCase } from '../../../core/usecase/expenses/delete-expenses.usecase';
import { GetAllExpensesUseCase } from '../../../core/usecase/expenses/get-all-expenses.usecase';
import { ExpensesForm } from './expenses-form/expenses-form';
import { SnackbarService } from '../../../core/helpers/components/snackbar.service';
import { InformationDialogDTO } from '../../../core/domain/dto/dialog.dto';
import { InformationDialogComponent } from '../../../core/helpers/components/information-dialog';
import { UpdateRequest } from '../../../core/domain/entities/http.entities';

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
  private updateExpensesUseCase = inject(UpdateExpensesUseCase);
  private deleteExpensesUseCase = inject(DeleteExpensesUseCase);
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
      datefilter: { fn: () => this.onDateFilter(payload), reload: true },
    };
    const handler = handlers[type];
    if (handler) {
      handler.fn();
      if (handler.reload) this.GetAllExpenses();
    }
  }

  onDateFilter($event: DateRangeFilter) {
    this.params.start_date = $event.startDate;
    this.params.end_date = $event.endDate;
  }

  OnHandleContext(e: { action: string; row: Expenses }) {
    const handlers: Record<string, { fn: () => void }> = {
      edit: { fn: () => this.onEdit(e.row) },
      delete: { fn: () => this.onDelete(e.row) },
    };
    const handler = handlers[e.action];
    if (handler) {
      handler.fn();
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
          }
          this.GetAllExpenses();
        },
        error: (err) => {
          this.openDialogInformation('Failed!', err.message, 'failed');
        }
      });
  }

  onEdit(row: Expenses) {
    this.dialogService
      .Open(ExpensesForm, {
        title: 'Edit Expenses',
        data: { mode: 'normal', expenses: row },
        width: '550px',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CreateExpensesDTO) => {
          if (res) this.onUpdateAction({ id: row.id, data: res });
        },
      });
  }

  onUpdateAction(body: UpdateRequest<CreateExpensesDTO>) {
    this.loader.set(true);
    this.updateExpensesUseCase
      .execute(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ExpensesCreateResponse) => {
          if (res.message) {
            this.snackbar.show(res.message, 'SUCCESS');
          }
          this.GetAllExpenses();
        },
        error: () => {
          this.loader.set(false);
        },
      });
  }

  onDelete(row: Expenses) {
    this.dialogService
      .Confirmation({
        title: 'Delete Expenses',
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

  onDeleteAction(id: number) {
    this.loader.set(true);
    this.deleteExpensesUseCase
      .execute(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ExpensesDeleteResponse) => {
          if (res.message) {
            this.snackbar.show(res.message, 'SUCCESS');
          }
          this.GetAllExpenses();
        },
        error: () => {
          this.loader.set(false);
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

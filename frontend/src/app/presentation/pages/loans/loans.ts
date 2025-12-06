import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { TableLocal } from '../../../core/helpers/components/table';
import { SortTable, TableColumn } from '../../../data/collection/table.collection';
import { LoanUseCase } from '../../../core/usecase/loans/get-all-loan.usecase';
import { DefaultParams } from '../../../core/domain/dto/base.dto';
import { Subject, takeUntil } from 'rxjs';
import { Loan, LoanResponse } from '../../../core/domain/entities/loan.entities';
import { DialogService } from '../../../core/helpers/services/dialog.service';
import { LoansForm } from './loans-form/loans-form';
import { LOAN_TABLE_COLUMN } from '../../../data/collection/loan.collections';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [TableLocal],
  templateUrl: './loans.html',
  styleUrl: './loans.scss',
})
export class LoansComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private loanUseCase = inject(LoanUseCase);
  private dialogService = inject(DialogService);
  protected loader = signal(true);
  params: DefaultParams = {
    page: 1,
    limit: 10,
  };

  cols: TableColumn[] = structuredClone(LOAN_TABLE_COLUMN);

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
    this.loanUseCase
      .execute(this.params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: LoanResponse) => {
          this.rows = res.data.rows;
          this.totalRows = res.data.total;
          this.loader.set(false);
        },
      });
  }

  OnTableChange(event: string, $event: any) {
    if (event === 'sort') this.onSort($event);
    if (event === 'search') this.onSearch($event);
    if (event === 'page') this.onPageChange($event);
    if (event === 'create') this.onCreate();
    this.GetAllLoan();
  }

  onRow($event: any) {}

  onCreate() {
    this.dialogService
      .Open(LoansForm, { title: 'Create New Loan', width: '800px', height: '500px' })
      .subscribe({
        next: (res) => {},
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
    this.params.page = $event;
  }
}

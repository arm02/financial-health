import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { BarChartLocal } from '../../../core/helpers/components/chart';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { GetDashboarSummaryUseCase } from '../../../core/usecase/dashboard/get-dashboard-summary.usecase';
import { GetChartSummaryUseCase } from '../../../core/usecase/dashboard/get-chart-summary.usecase';
import { GetDailyChartSummaryUseCase } from '../../../core/usecase/dashboard/get-daily-chart-summary.usecase';
import { ChartSummaryDTO, DailyChartSummaryDTO, DashboardSummaryDTO } from '../../../core/domain/dto/dashboard.dto';
import {
  ChartSummary,
  ChartSummaryResponse,
  DailySummary,
  DailySummaryResponse,
  DashboardSummary,
  DashboardSummaryResponse,
} from '../../../core/domain/entities/dashboard.entities';
import { LoaderBarLocal } from '../../../core/helpers/components/loader';
import { LoginData } from '../../../core/domain/entities/auth.entities';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DialogService } from '../../../core/helpers/services/dialog.service';
import { TransactionForm } from '../transactions/transaction-form/transaction-form';
import { CreateTransactionUseCase } from '../../../core/usecase/transactions/create-transaction.usecase';
import { CreateTransactionDTO } from '../../../core/domain/dto/transaction.dto';
import { TransactionCreateResponse } from '../../../core/domain/entities/transaction.entities';
import { SnackbarService } from '../../../core/helpers/components/snackbar.service';
import { ExpensesForm } from '../expenses/expenses-form/expenses-form';
import { CreateExpensesDTO } from '../../../core/domain/dto/expenses.dto';
import { ExpensesCreateResponse } from '../../../core/domain/entities/expenses.entities';
import { CreateExpensesUseCase } from '../../../core/usecase/expenses/create-expenses.usecase';
import { SavingsForm } from '../savings/savings-form/savings-form';
import { LoansForm } from '../loans/loans-form/loans-form';
import { CreateLoanDTO } from '../../../core/domain/dto/loan.dto';
import { LoanCreateResponse } from '../../../core/domain/entities/loan.entities';
import { CreateLoanUseCase } from '../../../core/usecase/loans/create-loan.usecase';

export type ChartViewMode = 'daily' | 'monthly';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, BarChartLocal, LoaderBarLocal, MatIconModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private dashboardSummaryUseCase = inject(GetDashboarSummaryUseCase);
  private chartSummaryUseCase = inject(GetChartSummaryUseCase);
  private dailyChartSummaryUseCase = inject(GetDailyChartSummaryUseCase);
  private createTransactionUseCase = inject(CreateTransactionUseCase);
  private createExpensesUseCase = inject(CreateExpensesUseCase);
  private createLoanUseCase = inject(CreateLoanUseCase);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private snackBarService = inject(SnackbarService);
  protected loader = signal(false);
  protected loaderChart = signal(false);
  user: LoginData = this.authService.getUserData();

  chartViewMode: ChartViewMode = 'daily';

  chartSummary: ChartSummary = {
    loans: [],
    income: [],
    outcome: [],
  };

  dailySummary: DailySummary = {
    labels: [],
    income: [],
    outcome: [],
  };

  summary: DashboardSummary = {
    total_loans: 0,
    total_remaining_loan: 0,
    total_expenses: 0,
    total_income: 0,
    total_outcome: 0,
  };

  today = new Date();
  firstDayOfMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
  lastDayOfMonth = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 1);
  summaryParams: DashboardSummaryDTO = {
    start_date: this.firstDayOfMonth.toISOString().split('T')[0],
    end_date: this.lastDayOfMonth.toISOString().split('T')[0],
  };

  chartParams: ChartSummaryDTO = {
    year: new Date(this.summaryParams.start_date).getFullYear(),
  };

  dailyChartParams: DailyChartSummaryDTO = {
    start_date: this.summaryParams.start_date,
    end_date: this.summaryParams.end_date,
  };

  ngOnInit(): void {
    this.GetDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  GetDashboardData() {
    this.chartParams.year = new Date(this.summaryParams.start_date).getFullYear();
    this.dailyChartParams.start_date = this.summaryParams.start_date;
    this.dailyChartParams.end_date = this.summaryParams.end_date;
    this.GetDashboardSummary();
    if (this.chartViewMode === 'daily') {
      this.GetDailyChartSummary();
    } else {
      this.GetChartSummary();
    }
  }

  onChartViewModeChange(mode: ChartViewMode) {
    this.chartViewMode = mode;
    if (mode === 'daily') {
      this.GetDailyChartSummary();
    } else {
      this.GetChartSummary();
    }
  }

  GetDashboardSummary() {
    this.loader.set(true);
    this.dashboardSummaryUseCase
      .execute(this.summaryParams)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DashboardSummaryResponse) => {
          this.summary = res.data;
          this.loader.set(false);
        },
        error: () => {
          this.loader.set(false);
        },
      });
  }

  GetChartSummary() {
    this.loaderChart.set(true);
    this.chartSummaryUseCase
      .execute(this.chartParams)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ChartSummaryResponse) => {
          this.chartSummary = res.data;
          this.loaderChart.set(false);
        },
        error: () => {
          this.loaderChart.set(false);
        },
      });
  }

  GetDailyChartSummary() {
    this.loaderChart.set(true);
    this.dailyChartSummaryUseCase
      .execute(this.dailyChartParams)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DailySummaryResponse) => {
          this.dailySummary = res.data;
          this.loaderChart.set(false);
        },
        error: () => {
          this.loaderChart.set(false);
        },
      });
  }

  onQuickAction(key: string, type?: string): void {
    const handler: Record<string, { fn: () => void }> = {
      transaction: { fn: () => this.onCreateTransaction(type) },
      normalTransaction: { fn: () => this.onCreateTransaction(type) },
      expenses: { fn: () => this.onCreateExpenses(type) },
      savings: { fn: () => this.onCreateSavings(type) },
      loans: { fn: () => this.onCreateLoan(type) },
    };
    handler[key].fn();
  }

  onCreateTransaction(type: string | undefined) {
    this.dialogService
      .Open(TransactionForm, {
        title: 'Create New Transaction',
        data: { mode: type || 'normal' },
        width: '550px',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CreateTransactionDTO) => {
          if (res) this.onCreateTransactionAction(res);
        },
      });
  }

  onCreateTransactionAction(body: CreateTransactionDTO) {
    this.loader.set(true);
    this.createTransactionUseCase
      .execute(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: TransactionCreateResponse) => {
          if (res.message) {
            this.snackBarService.show(res.message, 'SUCCESS');
          }
          this.GetDashboardData();
        },
      });
  }

  onCreateExpenses(type: string | undefined) {
    this.dialogService
      .Open(ExpensesForm, {
        title: 'Create New Expenses',
        data: { mode: type || 'normal' },
        width: '550px',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CreateExpensesDTO) => {
          if (res) this.onCreateExpensesAction(res);
        },
      });
  }

  onCreateExpensesAction(body: CreateExpensesDTO) {
    this.loader.set(true);
    this.createExpensesUseCase
      .execute(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ExpensesCreateResponse) => {
          if (res.message) {
            this.snackBarService.show(res.message, 'SUCCESS');
          }
          this.GetDashboardData();
        },
      });
  }

  onCreateSavings(type: string | undefined) {
    this.dialogService
      .Open(SavingsForm, {
        title: 'Create New Saving',
        data: { mode: type || 'normal' },
        width: '550px',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CreateTransactionDTO) => {
          if (res) this.onCreateSavingAction(res);
        },
      });
  }

  onCreateSavingAction(body: CreateTransactionDTO) {
    this.loader.set(true);
    this.createTransactionUseCase
      .execute(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: TransactionCreateResponse) => {
          if (res.message) {
            this.snackBarService.show(res.message, 'SUCCESS');
          }
          this.GetDashboardData();
        },
      });
  }

  onCreateLoan(type: string | undefined) {
    this.dialogService
      .Open(LoansForm, { title: 'Create New Loan', width: '550px' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CreateLoanDTO) => {
          if (res) this.onCreateLoanAction(res);
        },
      });
  }

  onCreateLoanAction(body: CreateLoanDTO) {
    this.loader.set(true);
    this.createLoanUseCase
      .execute(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: LoanCreateResponse) => {
          if (res.message) {
            this.snackBarService.show(res.message, 'SUCCESS');
          }
          this.GetDashboardData();
        },
      });
  }
}

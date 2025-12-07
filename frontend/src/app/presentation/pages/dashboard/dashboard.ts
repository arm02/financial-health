import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { BarChartLocal } from '../../../core/helpers/components/chart';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { GetDashboarSummaryUseCase } from '../../../core/usecase/dashboard/get-dashboard-summary.usecase';
import { GetChartSummaryUseCase } from '../../../core/usecase/dashboard/get-chart-summary.usecase';
import { ChartSummaryDTO, DashboardSummaryDTO } from '../../../core/domain/dto/dashboard.dto';
import {
  ChartSummary,
  ChartSummaryResponse,
  DashboardSummary,
  DashboardSummaryResponse,
} from '../../../core/domain/entities/dashboard.entities';
import { LoaderBarLocal } from '../../../core/helpers/components/loader';
import { LoginData } from '../../../core/domain/entities/auth.entities';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
  private authService = inject(AuthService);
  protected loader = signal(false);
  protected loaderChart = signal(false);
  user: LoginData = this.authService.getUserData();

  chartSummary: ChartSummary = {
    loans: [],
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

  ngOnInit(): void {
    this.GetDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  GetDashboardData() {
    this.chartParams.year = new Date(this.summaryParams.start_date).getFullYear();
    this.GetDashboardSummary();
    this.GetChartSummary();
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
}

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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BarChartLocal, LoaderBarLocal, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private dashboardSummaryUseCase = inject(GetDashboarSummaryUseCase);
  private chartSummaryUseCase = inject(GetChartSummaryUseCase);
  protected loader = signal(false);
  protected loaderChart = signal(false);

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

  ngOnInit(): void {
    this.GetDashboardSummary();
    this.GetChartSummary();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  GetDashboardSummary() {
    this.loader.set(true);
    const params: DashboardSummaryDTO = {
      start_date: '2025-01-01',
      end_date: '2027-12-31',
    };
    this.dashboardSummaryUseCase
      .execute(params)
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
    const params: ChartSummaryDTO = {
      year: new Date().getFullYear() + 1,
    };
    this.chartSummaryUseCase
      .execute(params)
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

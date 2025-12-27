import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { GetFinancialHealthUseCase } from '../../../core/usecase/analytics/get-financial-health.usecase';
import {
  FinancialHealthScore,
  FinancialHealthResponse,
  FinancialMetric,
} from '../../../core/domain/entities/analytics.entities';
import { LoaderBarLocal } from '../../../core/helpers/components/loader';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatIconModule, LoaderBarLocal],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private financialHealthUseCase = inject(GetFinancialHealthUseCase);
  protected loader = signal(false);

  healthScore: FinancialHealthScore = {
    overall_score: 0,
    overall_status: '',
    emergency_fund_ratio: { value: 0, score: 0, status: '', description: '' },
    debt_service_ratio: { value: 0, score: 0, status: '', description: '' },
    savings_ratio: { value: 0, score: 0, status: '', description: '' },
    liquidity_ratio: { value: 0, score: 0, status: '', description: '' },
    debt_to_income_ratio: { value: 0, score: 0, status: '', description: '' },
    recommendations: [],
    financial_summary: {
      total_income: 0,
      total_expenses: 0,
      total_savings: 0,
      total_debt: 0,
      monthly_debt_payment: 0,
      emergency_fund: 0,
      monthly_expenses: 0,
    },
  };

  ngOnInit(): void {
    this.getFinancialHealth();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFinancialHealth(): void {
    this.loader.set(true);
    this.financialHealthUseCase
      .execute()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: FinancialHealthResponse) => {
          this.healthScore = res.data;
          this.loader.set(false);
        },
        error: () => {
          this.loader.set(false);
        },
      });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Excellent':
        return '#22c55e';
      case 'Good':
        return '#50A2FF';
      case 'Fair':
        return '#f59e0b';
      case 'Poor':
        return '#dc2626';
      default:
        return '#666';
    }
  }

  getScoreRingStyle(score: number): object {
    const percentage = score;
    return {
      background: `conic-gradient(${this.getStatusColor(this.healthScore.overall_status)} ${percentage}%, #e5e7eb ${percentage}%)`,
    };
  }

  getMetricIcon(metric: string): string {
    const icons: Record<string, string> = {
      emergency_fund_ratio: 'savings',
      debt_service_ratio: 'credit_card',
      savings_ratio: 'account_balance_wallet',
      liquidity_ratio: 'water_drop',
      debt_to_income_ratio: 'trending_down',
    };
    return icons[metric] || 'analytics';
  }

  getMetricTitle(metric: string): string {
    const titles: Record<string, string> = {
      emergency_fund_ratio: 'Emergency Fund Ratio',
      debt_service_ratio: 'Debt Service Ratio (DSR)',
      savings_ratio: 'Savings Ratio',
      liquidity_ratio: 'Liquidity Ratio',
      debt_to_income_ratio: 'Debt-to-Income Ratio',
    };
    return titles[metric] || metric;
  }

  getMetrics(): { key: string; metric: FinancialMetric }[] {
    return [
      { key: 'emergency_fund_ratio', metric: this.healthScore.emergency_fund_ratio },
      { key: 'debt_service_ratio', metric: this.healthScore.debt_service_ratio },
      { key: 'savings_ratio', metric: this.healthScore.savings_ratio },
      { key: 'liquidity_ratio', metric: this.healthScore.liquidity_ratio },
      { key: 'debt_to_income_ratio', metric: this.healthScore.debt_to_income_ratio },
    ];
  }
}

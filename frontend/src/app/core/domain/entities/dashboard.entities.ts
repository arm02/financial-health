import { HttpResponse } from './http.entities';

export interface DashboardSummary {
  total_loans: number;
  total_remaining_loan: number;
  total_expenses: number;
  total_income: number;
  total_outcome: number;
}

export interface ChartSummary {
  loans: number[];
  income: number[];
  outcome: number[];
}

export interface DailySummary {
  labels: string[];
  income: number[];
  outcome: number[];
}

export type DashboardSummaryResponse = HttpResponse<DashboardSummary>;
export type ChartSummaryResponse = HttpResponse<ChartSummary>;
export type DailySummaryResponse = HttpResponse<DailySummary>;

import { HttpResponse } from './http.entities';

export interface FinancialMetric {
  value: number;
  score: number;
  status: string;
  description: string;
}

export interface FinancialSummary {
  total_income: number;
  total_expenses: number;
  total_savings: number;
  total_debt: number;
  monthly_debt_payment: number;
  emergency_fund: number;
  monthly_expenses: number;
}

export interface FinancialHealthScore {
  overall_score: number;
  overall_status: string;
  emergency_fund_ratio: FinancialMetric;
  debt_service_ratio: FinancialMetric;
  savings_ratio: FinancialMetric;
  liquidity_ratio: FinancialMetric;
  debt_to_income_ratio: FinancialMetric;
  recommendations: string[];
  financial_summary: FinancialSummary;
}

export type FinancialHealthResponse = HttpResponse<FinancialHealthScore>;

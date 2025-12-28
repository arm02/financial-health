import { HttpResponse, ListResponse } from './http.entities';

export interface Loan {
  id: number;
  user_id: number;
  title: string;
  tenor: number;
  tenor_type: string;
  amount: number;
  amount_due: number;
  total_amount: number;
  start_date: string;
  status: string;
  created_at: string;
}

export interface LoanDetail {
  id: number;
  loan_id: number;
  cycle_number: number;
  amount: number;
  due_date: string;
  status: string;
  paid_at?: string;
}

export interface LoanPaymentHistory {
  id: number;
  loan_detail_id: number;
  cycle_number: number;
  amount: number;
  transaction_date: string;
  title: string;
}

export type LoanResponse = HttpResponse<ListResponse<Loan[]>>;
export type LoanCreateResponse = HttpResponse<Loan>;
export type LoanDetailResponse = HttpResponse<ListResponse<LoanDetail[]>>;
export type LoanPaymentHistoryResponse = HttpResponse<ListResponse<LoanPaymentHistory[]>>;

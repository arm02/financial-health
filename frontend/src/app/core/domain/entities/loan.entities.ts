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

export type LoanResponse = HttpResponse<ListResponse<Loan[]>>;

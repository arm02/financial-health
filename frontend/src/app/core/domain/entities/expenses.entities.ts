import { HttpResponse, ListResponse } from './http.entities';

export interface Expenses {
  id: number;
  user_id: number;
  title: string;
  type: string;
  amount: number;
  created_at: string;
}

export type ExpensesResponse = HttpResponse<ListResponse<Expenses[]>>;
export type ExpensesCreateResponse = HttpResponse<Expenses>;

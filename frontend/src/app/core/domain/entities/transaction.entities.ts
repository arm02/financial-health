import { HttpResponse, ListResponse } from './http.entities';

export interface Transaction {
  id: number;
  user_id: number;
  title: string;
  type: string;
  reference_id: number;
  amount: number;
  transaction_date: string;
  created_at: string;
}

export type TransactionResponse = HttpResponse<ListResponse<Transaction[]>>;
export type TransactionCreateResponse = HttpResponse<Transaction>;
export type TransactionDeleteResponse = HttpResponse<string>;

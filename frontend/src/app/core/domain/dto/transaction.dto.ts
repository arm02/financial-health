export interface CreateTransactionDTO {
  title: string;
  type: string;
  amount?: number;
  reference_id?: number;
  transaction_date: string;
}

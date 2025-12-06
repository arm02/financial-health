import { DefaultParams } from './base.dto';

export interface CreateLoanDTO {
  title: string;
  tenor: number;
  tenor_type: string;
  amount: number;
  start_date: string;
}

export interface GetDetailLoanDTO {
  loanID: number;
  params: DefaultParams;
}

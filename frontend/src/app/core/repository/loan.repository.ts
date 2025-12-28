import { Observable } from 'rxjs';
import { DefaultParams } from '../domain/dto/base.dto';
import {
  LoanCreateResponse,
  LoanDetailResponse,
  LoanPaymentHistoryResponse,
  LoanResponse,
} from '../domain/entities/loan.entities';
import { CreateLoanDTO } from '../domain/dto/loan.dto';
import { HttpResponse } from '@angular/common/http';

export abstract class LoanRepository {
  abstract GetAll(params: DefaultParams): Observable<LoanResponse>;
  abstract Create(body: CreateLoanDTO): Observable<LoanCreateResponse>;
  abstract GetDetailLoan(loanID: number, params: DefaultParams): Observable<LoanDetailResponse>;
  abstract DeleteLoan(loanID: number): Observable<HttpResponse<null>>;
  abstract GetPaymentHistory(loanID: number, params: DefaultParams): Observable<LoanPaymentHistoryResponse>;
}

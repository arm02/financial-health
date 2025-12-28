import { inject, Injectable } from '@angular/core';
import { LoanRepository } from '../../core/repository/loan.repository';
import { Observable } from 'rxjs';
import { DefaultParams } from '../../core/domain/dto/base.dto';
import {
  LoanCreateResponse,
  LoanDetailResponse,
  LoanPaymentHistoryResponse,
  LoanResponse,
} from '../../core/domain/entities/loan.entities';
import { HttpService } from '../../core/helpers/services/http.service';
import { CreateLoanDTO } from '../../core/domain/dto/loan.dto';
import { HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HttpLoanRepository implements LoanRepository {
  private http = inject(HttpService);

  GetAll(params: DefaultParams): Observable<LoanResponse> {
    return this.http.Get(`loans/all`, params);
  }

  Create(body: CreateLoanDTO): Observable<LoanCreateResponse> {
    return this.http.Post(`loans/create`, body);
  }

  GetDetailLoan(loanID: number, params: DefaultParams): Observable<LoanDetailResponse> {
    return this.http.Get(`loans/details/${loanID}`, params);
  }

  DeleteLoan(loanID: number): Observable<HttpResponse<null>> {
    return this.http.Delete(`loans/${loanID}`);
  }

  GetPaymentHistory(loanID: number, params: DefaultParams): Observable<LoanPaymentHistoryResponse> {
    return this.http.Get(`loans/payment-history/${loanID}`, params);
  }
}

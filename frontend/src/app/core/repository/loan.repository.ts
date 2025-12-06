import { Observable } from 'rxjs';
import { DefaultParams } from '../domain/dto/base.dto';
import {
  LoanCreateResponse,
  LoanDetailResponse,
  LoanResponse,
} from '../domain/entities/loan.entities';
import { CreateLoanDTO } from '../domain/dto/loan.dto';

export abstract class LoanRepository {
  abstract GetAll(params: DefaultParams): Observable<LoanResponse>;
  abstract Create(body: CreateLoanDTO): Observable<LoanCreateResponse>;
  abstract GetDetailLoan(params: number): Observable<LoanDetailResponse>;
}

import { Observable } from 'rxjs';
import { DefaultParams } from '../domain/dto/base.dto';
import { LoanResponse } from '../domain/entities/loan.entities';

export abstract class LoanRepository {
  abstract GetAll(params: DefaultParams): Observable<LoanResponse>;
}

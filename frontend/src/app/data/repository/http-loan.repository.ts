import { inject, Injectable } from '@angular/core';
import { LoanRepository } from '../../core/repository/loan.repository';
import { Observable } from 'rxjs';
import { DefaultParams } from '../../core/domain/dto/base.dto';
import { LoanResponse } from '../../core/domain/entities/loan.entities';
import { HttpService } from '../../core/helpers/services/http.service';

@Injectable({ providedIn: 'root' })
export class HttpLoanRepository implements LoanRepository {
  private http = inject(HttpService);
  GetAll(params: DefaultParams): Observable<LoanResponse> {
    return this.http.Get(`loans/all`, params);
  }
}

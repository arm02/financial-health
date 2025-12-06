import { inject, Injectable } from '@angular/core';
import { LoanDetailResponse } from '../../domain/entities/loan.entities';
import { UseCase } from '../../base/usecase';
import { LoanRepository } from '../../repository/loan.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetDetailLoanUseCase implements UseCase<number, LoanDetailResponse> {
  private repository = inject(LoanRepository);

  execute(params: number): Observable<LoanDetailResponse> {
    return this.repository.GetDetailLoan(params);
  }
}

import { inject, Injectable } from '@angular/core';
import { LoanDetailResponse } from '../../domain/entities/loan.entities';
import { UseCase } from '../../base/usecase';
import { LoanRepository } from '../../repository/loan.repository';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DeleteLoanUseCase implements UseCase<number, HttpResponse<null>> {
  private repository = inject(LoanRepository);

  execute(loanID: number): Observable<HttpResponse<null>> {
    return this.repository.DeleteLoan(loanID);
  }
}

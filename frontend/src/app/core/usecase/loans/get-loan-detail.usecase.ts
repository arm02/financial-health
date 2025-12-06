import { inject, Injectable } from '@angular/core';
import { LoanDetailResponse } from '../../domain/entities/loan.entities';
import { UseCase } from '../../base/usecase';
import { LoanRepository } from '../../repository/loan.repository';
import { Observable } from 'rxjs';
import { DefaultParams } from '../../domain/dto/base.dto';
import { GetDetailLoanDTO } from '../../domain/dto/loan.dto';

@Injectable({
  providedIn: 'root',
})
export class GetDetailLoanUseCase implements UseCase<GetDetailLoanDTO, LoanDetailResponse> {
  private repository = inject(LoanRepository);

  execute(params: GetDetailLoanDTO): Observable<LoanDetailResponse> {
    return this.repository.GetDetailLoan(params.loanID, params.params);
  }
}

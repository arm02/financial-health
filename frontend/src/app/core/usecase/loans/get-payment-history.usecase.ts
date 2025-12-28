import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { LoanPaymentHistoryResponse } from '../../domain/entities/loan.entities';
import { LoanRepository } from '../../repository/loan.repository';
import { DefaultParams } from '../../domain/dto/base.dto';

interface GetPaymentHistoryParams {
  loanID: number;
  params: DefaultParams;
}

@Injectable({
  providedIn: 'root',
})
export class GetPaymentHistoryUseCase
  implements UseCase<GetPaymentHistoryParams, LoanPaymentHistoryResponse>
{
  private repository = inject(LoanRepository);

  execute(data: GetPaymentHistoryParams): Observable<LoanPaymentHistoryResponse> {
    return this.repository.GetPaymentHistory(data.loanID, data.params);
  }
}

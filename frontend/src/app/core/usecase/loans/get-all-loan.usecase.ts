import { inject, Injectable } from '@angular/core';
import { DefaultParams } from '../../domain/dto/base.dto';
import { LoanResponse } from '../../domain/entities/loan.entities';
import { UseCase } from '../../base/usecase';
import { LoanRepository } from '../../repository/loan.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoanUseCase implements UseCase<DefaultParams, LoanResponse> {
  private repository = inject(LoanRepository);

  execute(params: DefaultParams): Observable<LoanResponse> {
    return this.repository.GetAll(params);
  }
}

import { inject, Injectable } from '@angular/core';
import { LoanCreateResponse } from '../../domain/entities/loan.entities';
import { UseCase } from '../../base/usecase';
import { LoanRepository } from '../../repository/loan.repository';
import { Observable } from 'rxjs';
import { CreateLoanDTO } from '../../domain/dto/loan.dto';

@Injectable({
  providedIn: 'root',
})
export class CreateLoanUseCase implements UseCase<CreateLoanDTO, LoanCreateResponse> {
  private repository = inject(LoanRepository);

  execute(body: CreateLoanDTO): Observable<LoanCreateResponse> {
    return this.repository.Create(body);
  }
}

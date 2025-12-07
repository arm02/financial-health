import { inject, Injectable } from '@angular/core';
import { DefaultParams } from '../../domain/dto/base.dto';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { ExpensesResponse } from '../../domain/entities/expenses.entities';
import { ExpensesRepository } from '../../repository/expenses.repository';

@Injectable({
  providedIn: 'root',
})
export class GetAllExpensesUseCase implements UseCase<DefaultParams, ExpensesResponse> {
  private repository = inject(ExpensesRepository);

  execute(params: DefaultParams): Observable<ExpensesResponse> {
    return this.repository.GetAll(params);
  }
}

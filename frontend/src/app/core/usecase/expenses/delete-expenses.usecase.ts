import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { ExpensesDeleteResponse } from '../../domain/entities/expenses.entities';
import { ExpensesRepository } from '../../repository/expenses.repository';

@Injectable({
  providedIn: 'root',
})
export class DeleteExpensesUseCase implements UseCase<number, ExpensesDeleteResponse> {
  private repository = inject(ExpensesRepository);

  execute(id: number): Observable<ExpensesDeleteResponse> {
    return this.repository.Delete(id);
  }
}

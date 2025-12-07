import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { CreateExpensesDTO } from '../../domain/dto/expenses.dto';
import { ExpensesCreateResponse } from '../../domain/entities/expenses.entities';
import { ExpensesRepository } from '../../repository/expenses.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateExpensesUseCase implements UseCase<CreateExpensesDTO, ExpensesCreateResponse> {
  private repository = inject(ExpensesRepository);

  execute(body: CreateExpensesDTO): Observable<ExpensesCreateResponse> {
    return this.repository.Create(body);
  }
}

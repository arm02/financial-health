import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { ExpensesCreateResponse } from '../../domain/entities/expenses.entities';
import { ExpensesRepository } from '../../repository/expenses.repository';
import { UpdateRequest } from '../../domain/entities/http.entities';
import { CreateExpensesDTO } from '../../domain/dto/expenses.dto';

@Injectable({
  providedIn: 'root',
})
export class UpdateExpensesUseCase implements UseCase<UpdateRequest<CreateExpensesDTO>, ExpensesCreateResponse> {
  private repository = inject(ExpensesRepository);

  execute(body: UpdateRequest<CreateExpensesDTO>): Observable<ExpensesCreateResponse> {
    return this.repository.Update(body.id, body.data);
  }
}

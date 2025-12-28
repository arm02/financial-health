import { Observable } from 'rxjs';
import { DefaultParams } from '../domain/dto/base.dto';
import { ExpensesCreateResponse, ExpensesDeleteResponse, ExpensesResponse } from '../domain/entities/expenses.entities';
import { CreateExpensesDTO } from '../domain/dto/expenses.dto';

export abstract class ExpensesRepository {
  abstract GetAll(params: DefaultParams): Observable<ExpensesResponse>;
  abstract Create(body: CreateExpensesDTO): Observable<ExpensesCreateResponse>;
  abstract Update(id: number, body: CreateExpensesDTO): Observable<ExpensesCreateResponse>;
  abstract Delete(id: number): Observable<ExpensesDeleteResponse>;
}

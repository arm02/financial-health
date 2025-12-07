import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultParams } from '../../core/domain/dto/base.dto';
import { HttpService } from '../../core/helpers/services/http.service';
import { CreateExpensesDTO } from '../../core/domain/dto/expenses.dto';
import { ExpensesCreateResponse, ExpensesResponse } from '../../core/domain/entities/expenses.entities';
import { ExpensesRepository } from '../../core/repository/expenses.repository';

@Injectable({ providedIn: 'root' })
export class HttpExpensesRepository implements ExpensesRepository {
  private http = inject(HttpService);

  GetAll(params: DefaultParams): Observable<ExpensesResponse> {
    return this.http.Get(`expenses/all`, params);
  }

  Create(body: CreateExpensesDTO): Observable<ExpensesCreateResponse> {
    return this.http.Post(`expenses/create`, body);
  }
}

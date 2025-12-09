import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultParams } from '../../core/domain/dto/base.dto';
import { HttpService } from '../../core/helpers/services/http.service';
import { TransactionRepository } from '../../core/repository/transaction.repository';
import {
  TransactionCreateResponse,
  TransactionResponse,
} from '../../core/domain/entities/transaction.entities';
import { CreateTransactionDTO } from '../../core/domain/dto/transaction.dto';

@Injectable({ providedIn: 'root' })
export class HttpTransactionRepository implements TransactionRepository {
  private http = inject(HttpService);

  GetAll(params: DefaultParams): Observable<TransactionResponse> {
    return this.http.Get(`transactions/all`, params);
  }

  Create(body: CreateTransactionDTO): Observable<TransactionCreateResponse> {
    return this.http.Post(`transactions/create`, body);
  }

  Update(id: number, body: CreateTransactionDTO): Observable<TransactionCreateResponse> {
    return this.http.Put(`transactions/${id}`, body);
  }
}

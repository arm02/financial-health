import { Observable } from 'rxjs';
import { DefaultParams } from '../domain/dto/base.dto';
import {
  TransactionCreateResponse,
  TransactionResponse,
} from '../domain/entities/transaction.entities';
import { CreateTransactionDTO } from '../domain/dto/transaction.dto';

export abstract class TransactionRepository {
  abstract GetAll(params: DefaultParams): Observable<TransactionResponse>;
  abstract Create(body: CreateTransactionDTO): Observable<TransactionCreateResponse>;
  abstract Update(id: number, body: CreateTransactionDTO): Observable<TransactionCreateResponse>;
}

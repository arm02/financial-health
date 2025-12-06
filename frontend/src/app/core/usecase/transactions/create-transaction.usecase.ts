import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { CreateTransactionDTO } from '../../domain/dto/transaction.dto';
import { TransactionCreateResponse } from '../../domain/entities/transaction.entities';
import { TransactionRepository } from '../../repository/transaction.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateTransactionUseCase implements UseCase<CreateTransactionDTO, TransactionCreateResponse> {
  private repository = inject(TransactionRepository);

  execute(body: CreateTransactionDTO): Observable<TransactionCreateResponse> {
    return this.repository.Create(body);
  }
}

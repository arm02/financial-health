import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { TransactionDeleteResponse } from '../../domain/entities/transaction.entities';
import { TransactionRepository } from '../../repository/transaction.repository';

@Injectable({
  providedIn: 'root',
})
export class DeleteTransactionUseCase implements UseCase<number, TransactionDeleteResponse> {
  private repository = inject(TransactionRepository);

  execute(id: number): Observable<TransactionDeleteResponse> {
    return this.repository.Delete(id);
  }
}

import { inject, Injectable } from '@angular/core';
import { DefaultParams } from '../../domain/dto/base.dto';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { TransactionResponse } from '../../domain/entities/transaction.entities';
import { TransactionRepository } from '../../repository/transaction.repository';

@Injectable({
  providedIn: 'root',
})
export class GetAllTransactionUseCase implements UseCase<DefaultParams, TransactionResponse> {
  private repository = inject(TransactionRepository);

  execute(params: DefaultParams): Observable<TransactionResponse> {
    return this.repository.GetAll(params);
  }
}

import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { CreateTransactionDTO } from '../../domain/dto/transaction.dto';
import { TransactionCreateResponse } from '../../domain/entities/transaction.entities';
import { TransactionRepository } from '../../repository/transaction.repository';
import { UpdateRequest } from '../../domain/entities/http.entities';

@Injectable({
  providedIn: 'root',
})
export class UpdateTransactionUseCase
  implements UseCase<UpdateRequest<CreateTransactionDTO>, TransactionCreateResponse>
{
  private repository = inject(TransactionRepository);

  execute(body: UpdateRequest<CreateTransactionDTO>): Observable<TransactionCreateResponse> {
    return this.repository.Update(body.id, body.data);
  }
}

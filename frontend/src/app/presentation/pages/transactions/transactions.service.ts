import { inject, Injectable } from '@angular/core';
import { CreateTransactionDTO } from '../../../core/domain/dto/transaction.dto';
import { DateService } from '../../../core/helpers/services/date.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private dateService = inject(DateService);
  TransformSimpleQuery(query: string): {
    errorMessage: string;
    data?: CreateTransactionDTO | null;
  } {
    const splitQuery = query.split(',').map((v) => v.trim());
    let errorMessage = '';
    if (!splitQuery || splitQuery.length < 3) {
      errorMessage = "Input not valid: format must be follow 'title,type,amount'";
      return {
        errorMessage,
      };
    }

    const [title, type, amountStr] = splitQuery;

    if (!title || title.length === 0 || title.length > 50) {
      errorMessage = 'Title is required (max 50 chars)';
      return {
        errorMessage,
      };
    }

    const validTypes = ['debit', 'credit'];
    if (!type || !validTypes.includes(type)) {
      errorMessage = 'Type not valid, Use: debit or credit';
      return {
        errorMessage,
      };
    }

    const amount = Number(amountStr);
    if (isNaN(amount)) {
      errorMessage = 'Amount must be number';
      return {
        errorMessage,
      };
    }
    if (amount < 1000) {
      errorMessage = 'Minimum amount is 1000';
      return {
        errorMessage,
      };
    }

    const params: CreateTransactionDTO = {
      title,
      type,
      amount,
      transaction_date: this.dateService.TransformDateFormat(new Date()),
    };

    return {
      errorMessage: errorMessage,
      data: params,
    };
  }
}

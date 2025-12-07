import { inject, Injectable } from '@angular/core';
import { CreateTransactionDTO } from '../../../core/domain/dto/transaction.dto';
import { DateService } from '../../../core/helpers/services/date.service';

@Injectable({
  providedIn: 'root',
})
export class SavingsService {
  private dateService = inject(DateService);
  TransformSimpleQuery(query: string): {
    errorMessage: string;
    data?: CreateTransactionDTO | null;
  } {
    const splitQuery = query.split(',').map((v) => v.trim());
    let errorMessage = '';
    if (!splitQuery || splitQuery.length < 2) {
      errorMessage = "Input not valid: format must be follow 'title,amount'";
      return {
        errorMessage,
      };
    }

    const [title, amountStr] = splitQuery;

    if (!title || title.length === 0 || title.length > 50) {
      errorMessage = 'Title is required (max 50 chars)';
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
      type: "saving",
      amount,
      transaction_date: this.dateService.TransformDateFormat(new Date()),
    };

    return {
      errorMessage: errorMessage,
      data: params,
    };
  }
}

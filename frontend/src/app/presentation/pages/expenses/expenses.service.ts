import { Injectable } from '@angular/core';
import { CreateExpensesDTO } from '../../../core/domain/dto/expenses.dto';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  TransformSimpleQuery(query: string): {
    errorMessage: string;
    data?: CreateExpensesDTO | null;
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

    const validTypes = ['fixed'];
    if (!type || !validTypes.includes(type)) {
      errorMessage = 'Type not valid, Use: only can use fixed for now';
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

    const params: CreateExpensesDTO = {
      title,
      type,
      amount,
    };

    return {
      errorMessage: errorMessage,
      data: params,
    };
  }
}

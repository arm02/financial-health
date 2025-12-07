import { HttpAuthRepository } from '../../../data/repository/http-auth.repository';
import { HttpExpensesRepository } from '../../../data/repository/http-expenses.repository';
import { HttpLoanRepository } from '../../../data/repository/http-loan.repository';
import { HttpTransactionRepository } from '../../../data/repository/http-transaction.repository';
import { AuthRepository } from '../../repository/auth.repository';
import { ExpensesRepository } from '../../repository/expenses.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { TransactionRepository } from '../../repository/transaction.repository';

export const HttpProvider = [
  {
    provide: AuthRepository,
    useClass: HttpAuthRepository,
  },
  {
    provide: LoanRepository,
    useClass: HttpLoanRepository,
  },
  {
    provide: TransactionRepository,
    useClass: HttpTransactionRepository,
  },
  {
    provide: ExpensesRepository,
    useClass: HttpExpensesRepository,
  },
];

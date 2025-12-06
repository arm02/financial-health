import { ContextAction, TableColumn } from "../../core/domain/entities/table.entities";

export const LOAN_TABLE_COLUMN: TableColumn[] = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'status', label: 'Status', type: 'loan_status',  sortable: true },
  { key: 'tenor', label: 'Tenor', sortable: true },
  { key: 'tenor_type', label: 'Tenor Type', type: 'capitalize', sortable: false },
  { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
  { key: 'amount_due', label: 'Amount Due', type: 'currency', sortable: true },
  { key: 'total_amount', label: 'Total Amount', type: 'currency', sortable: true },
  { key: 'start_date', label: 'Start Date', type: 'short_date', sortable: true },
];

export const LOAN_DETAIL_TABLE_COLUMN: TableColumn[] = [
  { key: 'cycle_number', label: 'Cycle', sortable: true },
  { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
  { key: 'due_date', label: 'Due Date', type: 'short_date', sortable: true },
  { key: 'status', label: 'Status', type: 'payment_status', sortable: true },
];

export const LOAN_CONTEXT_MENU: ContextAction[] = [{ key: 'detail', label: 'Detail' }];
export const LOAN_DETAIL_CONTEXT_MENU: ContextAction[] = [{ key: 'pay', label: 'Pay Installment' }];

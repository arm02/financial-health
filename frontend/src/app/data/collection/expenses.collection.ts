import { ContextAction, TableColumn } from '../../core/domain/entities/table.entities';

export const EXPENSES_TABLE_COLUMN: TableColumn[] = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'type', label: 'Type', type: 'expenses_type', sortable: true },
  { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
  { key: 'created_at', label: 'Date', type: 'long_date', sortable: true },
];

export const EXPENSES_CONTEXT_MENU: ContextAction[] = [
  {
    key: 'detail',
    icon: 'info',
    label: 'Detail Expense',
  },
  {
    key: 'edit',
    icon: 'edit',
    label: 'Edit Expense',
  },
  {
    key: 'delete',
    icon: 'delete',
    label: 'Delete Expense',
  },
];

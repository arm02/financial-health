import { ContextAction, TableColumn } from "../../core/domain/entities/table.entities";

export const TRANSACTION_TABLE_COLUMN: TableColumn[] = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'type', label: 'Type', type: 'transaction_type', sortable: true },
  { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
  { key: 'transaction_date', label: 'Date', type: 'short_date', sortable: true },
];

export const TRANSACTION_CONTEXT_MENU: ContextAction[] = [
  { key: 'detail', label: 'Detail' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
];

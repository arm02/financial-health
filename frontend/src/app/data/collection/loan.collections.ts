import { TableColumn } from './table.collection';

export const LOAN_TABLE_COLUMN: TableColumn[] = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'tenor', label: 'Tenor', sortable: true },
  { key: 'tenor_type', label: 'Tenor Type', type: 'capitalize', sortable: false },
  { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
  { key: 'amount_due', label: 'Amount Due', type: 'currency', sortable: true },
  { key: 'total_amount', label: 'Total Amount', type: 'currency', sortable: true },
  { key: 'start_date', label: 'Start Date', type: 'short_date', sortable: true },
];

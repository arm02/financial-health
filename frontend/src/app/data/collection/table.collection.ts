export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface SortTable {
  sortBy: string;
  sortType: string;
}

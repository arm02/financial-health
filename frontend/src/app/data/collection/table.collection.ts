export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  type?: string;
}

export interface SortTable {
  sortBy: string;
  sortType: string;
}

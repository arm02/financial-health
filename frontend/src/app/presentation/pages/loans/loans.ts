import { Component } from '@angular/core';
import { TableComponent } from '../../../core/helpers/components/table';
import { SortTable, TableColumn } from '../../../data/collection/table.collection';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './loans.html',
  styleUrl: './loans.scss',
})
export class LoansComponent {
  cols: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true, width: '80px' },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, width: '120px' },
    { key: 'transaction_date', label: 'Date', sortable: true },
  ];

  rows = [{ id: 1, title: 'Payment', amount: 120.5, transaction_date: '2025-10-20' }];

  onRow($event: any) {
    console.log($event);
  }

  onSort($event: SortTable) {
    console.log($event);
  }

  onSearch($event: string) {
    console.log($event);
  }
}

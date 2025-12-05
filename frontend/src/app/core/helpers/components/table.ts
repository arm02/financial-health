import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { SortTable, TableColumn } from '../../../data/collection/table.collection';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="app-table">
      <div class="table-header">
        @if (showSearch) {
        <div class="search">
          <input
            type="text"
            class="search-input"
            [formControl]="query"
            [placeholder]="placeholder"
            aria-label="Search table"
          />
          @if (query.value) {
          <button class="clear" (click)="query.setValue('')" aria-label="Clear search">✕</button>
          }
        </div>
        }
      </div>

      <div class="table-wrap" role="table" aria-label="Data Table">
        <table>
          <thead>
            <tr role="row">
              @for (col of columns; track col.key) {
              <th
                role="columnheader"
                [style.width]="col.width || null"
                [class.sortable]="col.sortable"
                tabindex="{{ col.sortable ? 0 : -1 }}"
                (click)="toggleSort(col)"
                (keydown.enter)="toggleSort(col)"
                (keydown.space)="$event.preventDefault(); toggleSort(col)"
                [attr.aria-sort]="
                  sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                "
              >
                <span class="label">{{ col.label }}</span>
                @if (col.sortable) {
                <span class="sort-indicator">
                  <span class="tri up" [class.active]="sortKey === col.key && sortDir === 'asc'"
                    >▲</span
                  >
                  <span class="tri down" [class.active]="sortKey === col.key && sortDir === 'desc'"
                    >▼</span
                  >
                </span>
                }
              </th>

              }
            </tr>
          </thead>

          <tbody>
            @for (row of data; track $index) {
            <tr role="row" (click)="onRowClick(row)" tabindex="0">
              @for (col of columns; track col.key) {
              <td role="cell">
                {{ row[col.key] }}
              </td>
              }
            </tr>
            }
          </tbody>
        </table>
        @if (data.length === 0) {
        <div class="empty">
          <div>No data</div>
        </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['../../../../styles/table.scss'],
})
export class TableComponent implements AfterViewInit {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() showSearch = false;
  @Input() placeholder = 'Search...';

  @Output() onClick = new EventEmitter<any>();
  @Output() onSort = new EventEmitter<SortTable>();
  @Output() onSearch = new EventEmitter<string>();

  query = new FormControl('');
  sortKey: string | null = null;
  sortDir: 'asc' | 'desc' = 'asc';

  ngAfterViewInit(): void {
    this.query.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        if (value) this.onSearch.emit(value);
      },
    });
  }

  toggleSort(col: TableColumn) {
    if (!col.sortable) return;

    if (this.sortKey === col.key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = col.key;
      this.sortDir = 'asc';
    }
    this.onSort.emit({ sortBy: this.sortKey, sortType: this.sortDir });
  }

  onRowClick(row: any) {
    this.onClick.emit(row);
  }
}

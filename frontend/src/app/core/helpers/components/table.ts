import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { LoaderBarLocal } from './loader';
import { ContextAction, SortTable, TableColumn } from '../../domain/entities/table.entities';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderBarLocal],
  template: `
    <div class="app-table">
      <div class="table-header">
        @if (create) {
        <div class="table-action">
          <button class="btn-primary" (click)="onCreate.emit()">Create New</button>
        </div>
        }@if (simpleCreate) {
        <div class="table-action">
          <button class="btn-primary" (click)="onSimpleCreate.emit()">Simple Create</button>
        </div>
        } @if (showSearch) {
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
            <tr role="row" (click)="openContextMenu($event, row)" tabindex="0">
              @for (col of columns; track col.key) {
              <td role="cell">
                @if (col.type === 'capitalize') {
                <span class="text-capitalize"> {{ row[col.key] }}</span>
                } @else if(col.type === 'currency') {
                {{ row[col.key] | currency : 'IDR' : 'symbol' : '1.0-0' : 'id-ID' }}
                } @else if(col.type ==='short_date') {
                {{ row[col.key] | date : 'd MMM y' }}
                } @else if(col.type === 'payment_status') {
                <button class="text-capitalize status-payment {{ row[col.key] }}">
                  {{ row[col.key] }}
                </button>
                } @else if(col.type === 'transaction_type') {
                <button class="text-capitalize status-transaction {{ row[col.key] }}">
                  {{ row[col.key].replace('_', ' ') }}
                </button>
                } @else {
                {{ row[col.key] }}
                }
              </td>
              }
            </tr>
            }
          </tbody>
        </table>
        @if (loader) {
        <loader class="loader" [visibility]="loader"></loader>
        } @if (!data || data.length === 0 && !loader) {
        <div class="empty">
          <div>No data</div>
        </div>
        } @if (pagination) {
        <div class="pagination">
          <button (click)="prevPage()" [disabled]="page === 1">Prev</button>

          <span>{{ page }} / {{ totalPages }}</span>

          <button (click)="nextPage()" [disabled]="page >= totalPages">Next</button>
        </div>
        } @if(contextMenu.visible && showContextMenu) {
        <div class="context-menu" [style.top.px]="contextMenu.y" [style.left.px]="contextMenu.x">
          @for (context of contextMenuData; track context.key) {
          <button (click)="selectContext(context.key)">{{ context.label }}</button>
          }
        </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['../../../../styles/table.scss'],
})
export class TableLocal implements AfterViewInit {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() showSearch = false;
  @Input() placeholder = 'Search...';
  @Input() total: number = 0;
  @Input() page: number = 1;
  @Input() limit: number = 10;
  @Input() loader: boolean = true;
  @Input() create: boolean = true;
  @Input() simpleCreate: boolean = false;
  @Input() pagination: boolean = true;
  @Input() contextMenuData: ContextAction[] = [];
  @Input() showContextMenu: boolean = false;

  @Output() onSort = new EventEmitter<SortTable>();
  @Output() onSearch = new EventEmitter<string>();
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onCreate = new EventEmitter<any>();
  @Output() onSimpleCreate = new EventEmitter<any>();
  @Output() onContextAction = new EventEmitter<{ action: string; row: any }>();

  query = new FormControl('');
  sortKey: string | null = null;
  sortDir: 'asc' | 'desc' = 'asc';

  contextMenu = {
    visible: false,
    x: 0,
    y: 0,
    row: null as any,
  };

  constructor() {
    document.addEventListener('click', () => {
      this.contextMenu.visible = false;
    });
  }

  ngAfterViewInit(): void {
    this.query.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        this.onSearch.emit(value || '');
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

  nextPage() {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.onPageChange.emit(this.page);
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.onPageChange.emit(this.page);
    }
  }

  openContextMenu(event: MouseEvent, row: any) {
    event.stopPropagation();
    this.contextMenu = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      row,
    };
  }

  selectContext(action: string) {
    this.onContextAction.emit({
      action,
      row: this.contextMenu.row,
    });
    this.contextMenu.visible = false;
  }

  get totalPages() {
    return Math.ceil(this.total / this.limit);
  }
}

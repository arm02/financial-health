import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Todo, TodoCreateResponse, TodoResponse } from '../../../core/domain/entities/todo.entities';
import { CreateTodoDTO, TodoParams } from '../../../core/domain/dto/todo.dto';
import { GetAllTodoUseCase } from '../../../core/usecase/todos/get-all-todo.usecase';
import { CreateTodoUseCase } from '../../../core/usecase/todos/create-todo.usecase';
import { UpdateTodoUseCase } from '../../../core/usecase/todos/update-todo.usecase';
import { DeleteTodoUseCase } from '../../../core/usecase/todos/delete-todo.usecase';
import { ToggleTodoUseCase } from '../../../core/usecase/todos/toggle-todo.usecase';
import { SnackbarService } from '../../../core/helpers/components/snackbar.service';
import { DialogService } from '../../../core/helpers/services/dialog.service';
import { TODO_PRIORITIES, TODO_STATUSES } from '../../../data/collection/todo.collection';
import { LoaderBarLocal } from '../../../core/helpers/components/loader';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, LoaderBarLocal],
  templateUrl: './todos.html',
  styleUrl: './todos.scss',
})
export class TodosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private getAllTodoUseCase = inject(GetAllTodoUseCase);
  private createTodoUseCase = inject(CreateTodoUseCase);
  private updateTodoUseCase = inject(UpdateTodoUseCase);
  private deleteTodoUseCase = inject(DeleteTodoUseCase);
  private toggleTodoUseCase = inject(ToggleTodoUseCase);
  private snackbar = inject(SnackbarService);
  private dialogService = inject(DialogService);

  protected loader = signal(false);
  protected priorities = TODO_PRIORITIES;
  protected statuses = TODO_STATUSES;

  // Quick add form
  newTodoTitle = '';
  newTodoPriority: 'low' | 'medium' | 'high' = 'medium';
  newTodoDueDate = '';
  showQuickOptions = false;

  // Edit mode
  editingTodo: Todo | null = null;
  editTitle = '';
  editDescription = '';
  editPriority: 'low' | 'medium' | 'high' = 'medium';
  editDueDate = '';

  // Filters
  filterStatus = '';
  filterPriority = '';

  params: TodoParams = {
    page: 1,
    limit: 50,
  };

  todos: Todo[] = [];
  totalRows = 0;

  ngOnInit(): void {
    this.GetAllTodos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  GetAllTodos(): void {
    this.loader.set(true);
    this.params.status = this.filterStatus;
    this.params.priority = this.filterPriority;

    this.getAllTodoUseCase
      .execute(this.params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: TodoResponse) => {
          this.todos = res.data.rows || [];
          this.totalRows = res.data.total;
          this.loader.set(false);
        },
        error: () => {
          this.loader.set(false);
        },
      });
  }

  quickAdd(): void {
    if (!this.newTodoTitle.trim()) return;

    const body: CreateTodoDTO = {
      title: this.newTodoTitle.trim(),
      priority: this.newTodoPriority,
      due_date: this.newTodoDueDate || null,
    };

    this.createTodoUseCase
      .execute(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: TodoCreateResponse) => {
          this.snackbar.show('Todo added!', 'SUCCESS');
          this.newTodoTitle = '';
          this.newTodoPriority = 'medium';
          this.newTodoDueDate = '';
          this.showQuickOptions = false;
          this.GetAllTodos();
        },
      });
  }

  toggleStatus(todo: Todo): void {
    this.toggleTodoUseCase
      .execute(todo.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.GetAllTodos();
        },
      });
  }

  startEdit(todo: Todo): void {
    // Set values FIRST before switching to edit mode
    this.editTitle = todo.title;
    this.editDescription = todo.description || '';
    this.editPriority = todo.priority;
    this.editDueDate = todo.due_date || '';
    // Then switch to edit mode
    this.editingTodo = todo;
  }

  cancelEdit(): void {
    this.editingTodo = null;
  }

  saveEdit(): void {
    if (!this.editingTodo || !this.editTitle.trim()) return;

    const body: CreateTodoDTO = {
      title: this.editTitle.trim(),
      description: this.editDescription,
      priority: this.editPriority,
      status: this.editingTodo.status,
      due_date: this.editDueDate || null,
    };

    this.updateTodoUseCase
      .execute({ id: this.editingTodo.id, data: body })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackbar.show('Todo updated!', 'SUCCESS');
          this.editingTodo = null;
          this.GetAllTodos();
        },
      });
  }

  deleteTodo(todo: Todo): void {
    this.dialogService
      .Confirmation({
        title: 'Delete Todo',
        message: `Are you sure you want to delete "${todo.title}"?`,
        btnConfirm: 'Delete',
        btnCancel: 'Cancel',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (confirmed: boolean) => {
          if (confirmed) {
            this.deleteTodoUseCase
              .execute(todo.id)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.snackbar.show('Todo deleted!', 'SUCCESS');
                  this.GetAllTodos();
                },
              });
          }
        },
      });
  }

  getPriorityColor(priority: string): string {
    const p = this.priorities.find((pr) => pr.value === priority);
    return p?.color || '#6b7280';
  }

  onFilterChange(): void {
    this.GetAllTodos();
  }

  clearFilters(): void {
    this.filterStatus = '';
    this.filterPriority = '';
    this.GetAllTodos();
  }

  get pendingCount(): number {
    return this.todos.filter((t) => t.status !== 'completed').length;
  }

  get completedCount(): number {
    return this.todos.filter((t) => t.status === 'completed').length;
  }
}

import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { TodoCreateResponse } from '../../domain/entities/todo.entities';
import { TodoRepository } from '../../repository/todo.repository';

@Injectable({
  providedIn: 'root',
})
export class ToggleTodoUseCase implements UseCase<number, TodoCreateResponse> {
  private repository = inject(TodoRepository);

  execute(id: number): Observable<TodoCreateResponse> {
    return this.repository.ToggleStatus(id);
  }
}

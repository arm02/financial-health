import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { TodoDeleteResponse } from '../../domain/entities/todo.entities';
import { TodoRepository } from '../../repository/todo.repository';

@Injectable({
  providedIn: 'root',
})
export class DeleteTodoUseCase implements UseCase<number, TodoDeleteResponse> {
  private repository = inject(TodoRepository);

  execute(id: number): Observable<TodoDeleteResponse> {
    return this.repository.Delete(id);
  }
}

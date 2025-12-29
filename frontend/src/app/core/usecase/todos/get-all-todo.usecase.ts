import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { TodoParams } from '../../domain/dto/todo.dto';
import { TodoResponse } from '../../domain/entities/todo.entities';
import { TodoRepository } from '../../repository/todo.repository';

@Injectable({
  providedIn: 'root',
})
export class GetAllTodoUseCase implements UseCase<TodoParams, TodoResponse> {
  private repository = inject(TodoRepository);

  execute(params: TodoParams): Observable<TodoResponse> {
    return this.repository.GetAll(params);
  }
}

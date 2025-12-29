import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { CreateTodoDTO } from '../../domain/dto/todo.dto';
import { TodoCreateResponse } from '../../domain/entities/todo.entities';
import { TodoRepository } from '../../repository/todo.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateTodoUseCase implements UseCase<CreateTodoDTO, TodoCreateResponse> {
  private repository = inject(TodoRepository);

  execute(body: CreateTodoDTO): Observable<TodoCreateResponse> {
    return this.repository.Create(body);
  }
}

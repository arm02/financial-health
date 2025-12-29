import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { TodoCreateResponse } from '../../domain/entities/todo.entities';
import { TodoRepository } from '../../repository/todo.repository';
import { UpdateRequest } from '../../domain/entities/http.entities';
import { CreateTodoDTO } from '../../domain/dto/todo.dto';

@Injectable({
  providedIn: 'root',
})
export class UpdateTodoUseCase implements UseCase<UpdateRequest<CreateTodoDTO>, TodoCreateResponse> {
  private repository = inject(TodoRepository);

  execute(body: UpdateRequest<CreateTodoDTO>): Observable<TodoCreateResponse> {
    return this.repository.Update(body.id, body.data);
  }
}

import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/helpers/services/http.service';
import { CreateTodoDTO, TodoParams } from '../../core/domain/dto/todo.dto';
import { TodoCreateResponse, TodoDeleteResponse, TodoResponse } from '../../core/domain/entities/todo.entities';
import { TodoRepository } from '../../core/repository/todo.repository';

@Injectable({ providedIn: 'root' })
export class HttpTodoRepository implements TodoRepository {
  private http = inject(HttpService);

  GetAll(params: TodoParams): Observable<TodoResponse> {
    return this.http.Get(`todos/all`, params);
  }

  Create(body: CreateTodoDTO): Observable<TodoCreateResponse> {
    return this.http.Post(`todos/create`, body);
  }

  Update(id: number, body: CreateTodoDTO): Observable<TodoCreateResponse> {
    return this.http.Put(`todos/${id}`, body);
  }

  Delete(id: number): Observable<TodoDeleteResponse> {
    return this.http.Delete(`todos/${id}`);
  }

  ToggleStatus(id: number): Observable<TodoCreateResponse> {
    return this.http.Patch(`todos/${id}/toggle`, {});
  }
}

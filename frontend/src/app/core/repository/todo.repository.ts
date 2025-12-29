import { Observable } from 'rxjs';
import { CreateTodoDTO, TodoParams } from '../domain/dto/todo.dto';
import { TodoCreateResponse, TodoDeleteResponse, TodoResponse } from '../domain/entities/todo.entities';

export abstract class TodoRepository {
  abstract GetAll(params: TodoParams): Observable<TodoResponse>;
  abstract Create(body: CreateTodoDTO): Observable<TodoCreateResponse>;
  abstract Update(id: number, body: CreateTodoDTO): Observable<TodoCreateResponse>;
  abstract Delete(id: number): Observable<TodoDeleteResponse>;
  abstract ToggleStatus(id: number): Observable<TodoCreateResponse>;
}

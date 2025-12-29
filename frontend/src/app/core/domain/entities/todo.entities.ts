import { HttpResponse, ListResponse } from './http.entities';

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string | null;
  created_at: string;
  updated_at: string | null;
}

export type TodoResponse = HttpResponse<ListResponse<Todo[]>>;
export type TodoCreateResponse = HttpResponse<Todo>;
export type TodoDeleteResponse = HttpResponse<string>;

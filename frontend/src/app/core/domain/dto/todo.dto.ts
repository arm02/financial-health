import { DefaultParams } from './base.dto';

export interface CreateTodoDTO {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed';
  due_date?: string | null;
}

export interface TodoParams extends DefaultParams {
  status?: string;
  priority?: string;
}

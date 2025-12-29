import { ContextAction } from '../../core/domain/entities/table.entities';

export const TODO_CONTEXT_MENU: ContextAction[] = [
  {
    key: 'edit',
    icon: 'edit',
    label: 'Edit Todo',
  },
  {
    key: 'delete',
    icon: 'delete',
    label: 'Delete Todo',
  },
];

export const TODO_PRIORITIES = [
  { value: 'low', label: 'Low', color: '#22c55e' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
];

export const TODO_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

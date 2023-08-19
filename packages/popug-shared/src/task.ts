
export const TasksStatuses = {
  PROGRESS: 'in_progress',
  DONE: 'done'
} as const;

export type TaskStatus = typeof TasksStatuses[keyof typeof TasksStatuses]

export {uuid} from './uuid'

export const POPUG_ROLES = {
  'admin': 'admin',
  'regular': 'regular'
} as const

export const CUD_EVENT = {
  USER_DELETED: 'UserDeleted',
  USER_CREATED: 'UserCreated',
  TASK_UPDATED: 'TaskUpdated'
};

export const BUSINESS_EVENT = {
  USER_ROLE_CHANGED: 'UserRoleChanged',
  TASK_ADDED: 'TaskAdded',
  TASK_COMPLETED: 'TaskCompleted',
  TASKS_SHUFFLE_STARTED: 'TasksShuffleStarted'
};

export const TOPICS_NAMES = {
  USERS_STREAM: 'users.stream',
  USERS_ROLE_CHANGED: 'users.role-changed',
  TASKS_ADDED: 'tasks.added',
  TASKS_COMPLETED: 'tasks.completed',
  TASKS_STREAM: 'tasks.stream',
  TASKS_SHUFFLE_STARTED: 'tasks.shuffle-started',
};

export type IBrokerTopic = typeof TOPICS_NAMES[keyof typeof TOPICS_NAMES]

export type ICudEventsValues = typeof CUD_EVENT[keyof typeof CUD_EVENT]
export type IBusinessEventsValues = typeof BUSINESS_EVENT[keyof typeof BUSINESS_EVENT]

export type IBrokerEvent = {
  type: ICudEventsValues | IBusinessEventsValues,
  data: Record<string, any>
} & Record<string, any>

export type IPopugRole = typeof POPUG_ROLES[keyof typeof POPUG_ROLES]

export type IPopug = {
  publicId: string
  email: string
  role: IPopugRole
}

export const TasksStatuses = {
  PROGRESS: 'in_progress',
  DONE: 'done'
} as const;

export type TaskStatus = typeof TasksStatuses[keyof typeof TasksStatuses]

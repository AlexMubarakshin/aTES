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
  type: ICudEventsValues | IBusinessEventsValues;
  producer: string
  time: Date,
  id: string
  version: number;
  data: Record<string, any>;
} & Record<string, any>

export type IBrokerTransportEvent = IBrokerEvent & {}

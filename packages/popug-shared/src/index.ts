export {uuid} from './uuid'

export const POPUG_ROLES = {
  'admin': 'admin',
  'regular': 'regular'
} as const

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

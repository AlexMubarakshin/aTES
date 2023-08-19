export const POPUG_ROLES = {
  'accounting': 'accounting',
  'admin': 'admin',
  'regular': 'regular'
} as const

export type IPopugRole = typeof POPUG_ROLES[keyof typeof POPUG_ROLES]

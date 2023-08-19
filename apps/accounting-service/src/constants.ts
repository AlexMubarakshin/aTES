export const AUDIT_LOG_STATUS = {
  CREATED: 'created',
  PAYED: 'payed'
} as const;

export const AUDIT_LOG_TYPE = {
  RECEIPT: 'receipt',
  SPENDING: 'spending'
} as const;

export type IAuditLogStatus = typeof AUDIT_LOG_STATUS[keyof typeof AUDIT_LOG_STATUS]
export type IAuditLogType = typeof AUDIT_LOG_TYPE[keyof typeof AUDIT_LOG_TYPE]

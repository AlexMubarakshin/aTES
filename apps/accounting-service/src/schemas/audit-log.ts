import mongoose from 'mongoose';
import {AUDIT_LOG_STATUS, AUDIT_LOG_TYPE} from "../constants";

const AuditLogSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  userId: {type: String, required: true},
  taskId: {type: String, required: true},
  type: {type: String, required: true, enum: Object.values(AUDIT_LOG_TYPE)},
  status: {type: String, required: true, enum: Object.values(AUDIT_LOG_STATUS), default: AUDIT_LOG_STATUS.CREATED}
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

export const AuditLog = mongoose.model('audit-log', AuditLogSchema);



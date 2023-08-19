import mongoose from 'mongoose';
import {TasksStatuses} from "popug-shared";

const taskSchema = new mongoose.Schema({
  title: {type: String, required: true},
  assigneeId: {type: String, required: true},
  creatorId: {type: String, required: true},
  description: {type: String},
  jiraId: { type: Number, required: true },
  status: {type: String, enum: [TasksStatuses.PROGRESS, TasksStatuses.DONE], default: TasksStatuses.PROGRESS},
});

export const Task = mongoose.model('Task', taskSchema);

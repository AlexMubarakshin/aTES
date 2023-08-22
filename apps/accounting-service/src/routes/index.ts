import express from 'express';
import path from "path";
import {POPUG_ROLES, TasksStatuses} from "popug-shared";
import {Task} from "../schemas/task";
import {AuditLog} from "../schemas/audit-log";
import {User} from "../schemas/user";

export const router = express.Router()
  .get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
  })
  .get('/balance', async (req, res) => {
    try {
      const currentUserId = (req.session as any).user.publicId;
      const user = await User.findOne({publicId: currentUserId});
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }
      res.json({balance: user.balance});
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
    }
  }).get('/audit-log', async (req, res) => {
    try {
      const currentUserId = (req.session as any).user.publicId;
      const auditLogs = await AuditLog.find({userId: currentUserId}).sort('-created_at');
      res.json({auditLogs});
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
    }
  }).get('/tasks-stats', async (req, res) => {
    try {
      const currentUserId = (req.session as any).user.publicId;
      const user = await User.findOne({publicId: currentUserId});

      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }

      if (user.role === POPUG_ROLES.regular) {
        return res.status(404).json({message: 'Not found'});
      }

      const tasksStatistics = await Task.aggregate([
        {$group: {_id: '$status', count: {$sum: 1}}}
      ]);

      const completedTasksSum = await Task.aggregate([
        {$match: {status: TasksStatuses.DONE}},
        {$group: {_id: null, sum: {$sum: '$fee'}}}
      ]);

      const assignedTasksSum = await Task.aggregate([
        {$group: {_id: '$assigneeId', sum: {$sum: '$cost'}}}
      ]);

      const earnsStatistics = (completedTasksSum[0]?.sum || 0) + (assignedTasksSum[0]?.sum || 0) * -1;

      res.json({tasksStatistics, earnsStatistics});
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
    }
  })


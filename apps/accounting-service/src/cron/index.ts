import cron from 'node-cron';
import {TasksStatuses} from "popug-shared";

import {AuditLog} from "../schemas/audit-log";
import {User} from "../schemas/user";

cron.schedule('0 0 * * *', async () => {
  const userIds = await User.distinct('_id', {balance: {$gt: 0}});

  await Promise.all(userIds.map(async (userId) => {
    // TODO: Add email notifications here

    await AuditLog.updateMany({userId: userId}, {$set: {status: TasksStatuses.DONE}});
    await User.updateOne({_id: userId}, {$set: {balance: 0}});
  }))
  ;
});

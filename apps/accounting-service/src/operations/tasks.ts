import {BUSINESS_EVENT, IBrokerEvent} from "popug-shared";
import {parseJiraIdFromString} from "../helpers/parse";
import {generateTaskValues} from "../helpers/calculations";
import {Task} from "../schemas/task";
import {AUDIT_LOG_STATUS, AUDIT_LOG_TYPE} from "../constants";
import {AuditLog} from "../schemas/audit-log";
import {User} from "../schemas/user";
import {IProcessMessage} from "./types";

async function addTask(event: IBrokerEvent) {
  const assignee = await User.findOne({publicId: event.data.assignee_public_id});
  if (!assignee) {
    console.log('Assignee not found for event', event);

    // TODO: Implement retry strategy

    return
  }
  const creator = await User.findOne({publicId: event.data.creator_public_id});
  if (!creator) {
    console.log('Creator not found for event', event);

    // TODO: Implement retry strategy

    return
  }

  const exists = await Task.exists({publicId: event.data.publicId});
  if (exists) return null;

  const taskValues = generateTaskValues()

  const task = await Task.create({
    publicId: event.data.publicId,

    description: event.data.description,
    status: AUDIT_LOG_STATUS.CREATED,

    creator: creator._id,
    assignee: assignee._id,
    fee: taskValues.fee,
    cost: taskValues.cost,
    jiraId: event.data.jiraId,
  });

  return Promise.all([
    User.updateOne({_id: creator._id}, {$inc: {balance: -task.fee}}),
    AuditLog.create({
      userId: creator._id,
      taskId: task._id,
      type: AUDIT_LOG_TYPE.SPENDING
    })
  ]);
}

export const processMessage: IProcessMessage = (message) => {
  const event: IBrokerEvent = JSON.parse((message as any).value);

  switch (event.type) {
    case BUSINESS_EVENT.TASK_ADDED: {
      const pseudoEvent = {...event};
      const jiraIdInTitle = parseJiraIdFromString(event.data.title);

      if (event.version === 1 || jiraIdInTitle) {
        pseudoEvent.data.jiraId = jiraIdInTitle || Math.floor(Math.random() * 9000) + 1000
      }

      return addTask(pseudoEvent)
    }

    default:
      return
  }
}

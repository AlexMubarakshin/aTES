import * as console from "console";
import {ObjectSchema, ValidationResult as JoiValidationResult} from "joi";
import {BUSINESS_EVENT, CUD_EVENT, IBrokerEvent, IBusinessEventsValues, ICudEventsValues} from "./constants";

import UsersCreatedV1 from './users/created-v1'
import UsersDeletedV1 from './users/deleted-v1'
import TasksUpdatedV1 from './tasks/updated-v1'
import TasksUpdatedV2 from './tasks/updated-v2'
import UsersRoleChangedV1 from './users/role-changed-v1'
import TasksAddedV1 from './tasks/added-v1'
import TasksAddedV2 from './tasks/added-v2'
import TasksCompletedV1 from './tasks/completed-v1'
import TasksShuffleStartedV1 from './tasks/shuffle-started-v1'

const EVENT_NAME_TO_SCHEMA_PATH: Record<ICudEventsValues | IBusinessEventsValues, Array<{
  version: number;
  schema: ObjectSchema
}>> = {
  [CUD_EVENT.USER_CREATED]: [{schema: UsersCreatedV1, version: 1},],
  [CUD_EVENT.USER_DELETED]: [{schema: UsersDeletedV1, version: 1},],
  [CUD_EVENT.TASK_UPDATED]: [{schema: TasksUpdatedV1, version: 1}, {schema: TasksUpdatedV2, version: 2}],
  [BUSINESS_EVENT.USER_ROLE_CHANGED]: [{schema: UsersRoleChangedV1, version: 1},],
  [BUSINESS_EVENT.TASK_ADDED]: [{schema: TasksAddedV1, version: 1}, {schema: TasksAddedV2, version: 2}],
  [BUSINESS_EVENT.TASK_COMPLETED]: [{schema: TasksCompletedV1, version: 1},],
  [BUSINESS_EVENT.TASKS_SHUFFLE_STARTED]: [{schema: TasksShuffleStartedV1, version: 1},],
};

export function validateEvent(event: IBrokerEvent) {
  const schemas = EVENT_NAME_TO_SCHEMA_PATH[event.type];
  const schema = schemas?.find(s => s.version === event.version)
  if (!schema) return {
    isValid: false,
    error: {type: `Missing schema for event with type ${event.type} or version ${event.version}`}
  };

  try {

    const result: JoiValidationResult = schema.schema.validate(event, {abortEarly: false});

    if (result.error) {
      const error = result.error.details.map((e) => ({[e.path.join('.')]: e.message}));
      return {isValid: false, error};
    }

    return {isValid: true, error: null};
  } catch (error) {
    console.error(error)
    return {isValid: false, error: {version: `Unknown error for event ${event.type} v${event.version}`}};
  }
}

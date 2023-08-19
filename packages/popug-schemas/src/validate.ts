import {ValidationResult as JoiValidationResult} from "joi";
import {BUSINESS_EVENT, CUD_EVENT, IBrokerEvent, IBusinessEventsValues, ICudEventsValues} from "./constants";

const EVENT_NAME_TO_SCHEMA_PATH: Record<ICudEventsValues | IBusinessEventsValues, string> = {
  [CUD_EVENT.USER_CREATED]: 'users/created',
  [CUD_EVENT.USER_DELETED]: 'users/deleted',
  [CUD_EVENT.TASK_UPDATED]: 'tasks/updated',
  [BUSINESS_EVENT.USER_ROLE_CHANGED]: 'users/role-changed',
  [BUSINESS_EVENT.TASK_ADDED]: 'tasks/added',
  [BUSINESS_EVENT.TASK_COMPLETED]: 'tasks/completed',
  [BUSINESS_EVENT.TASKS_SHUFFLE_STARTED]: 'tasks/shuffle-started',
};

export function validateEvent(event: IBrokerEvent) {
  const path = EVENT_NAME_TO_SCHEMA_PATH[event.type];
  if (!path) return {isValid: false, error: {type: `Missing schema for event with type ${event.type}`}};

  try {
    const schema = require(`./shemas/${path}-${event.version}`);

    const result: JoiValidationResult = schema.validate(event, {abortEarly: false});

    if (result.error) {
      const error = result.error.details.map((e) => ({[e.path.join('.')]: e.message}));
      return {isValid: false, error};
    }

    return {isValid: true, error: null};
  } catch (error) {
    return {isValid: false, error: {version: `No schema for event with version ${event.vestion}`}};
  }
}

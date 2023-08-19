import Joi from "joi";
import {BUSINESS_EVENT} from "../constants";
import schemaBase from "../schema-base";

const schema = schemaBase.keys({
  version: Joi.number().valid(1).required(),
  type: Joi.string().valid(BUSINESS_EVENT.TASK_ADDED),
  data: Joi.object({
    publicId: Joi.string().guid({version: ['uuidv4']}).required(),
    description: Joi.string().required(),
    assignee_public_id: Joi.string().guid({version: ['uuidv4']}).required(),
    creator_public_id: Joi.string().guid({version: ['uuidv4']}).required()
  })
});

export default schema

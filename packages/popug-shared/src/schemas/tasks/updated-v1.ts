import Joi from "joi";
import {CUD_EVENT} from "../constants";
import schemaBase from "../schema-base";

const schema = schemaBase.keys({
  version: Joi.number().valid(1).required(),
  type: Joi.string().valid(CUD_EVENT.TASK_UPDATED),
  data: Joi.object({
    publicId: Joi.string().guid({version: ['uuidv4']}).required(),
    assignee_public_id: Joi.string().guid({version: ['uuidv4']}),
    description: Joi.string()
  })
});

export default schema

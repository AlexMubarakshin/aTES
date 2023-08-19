import Joi from "joi";
import {BUSINESS_EVENT} from "../constants";
import schemaBase from "../schema-base";

const schema = schemaBase.keys({
  version: Joi.number().valid(1).required(),
  type: Joi.string().valid(BUSINESS_EVENT.TASKS_SHUFFLE_STARTED),
  data: Joi.object({
    emitter: Joi.string().required()
  })
});

export default schema

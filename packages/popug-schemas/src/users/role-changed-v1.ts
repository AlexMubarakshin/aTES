import Joi from "joi";
import {POPUG_ROLES} from "popug-shared";
import {BUSINESS_EVENT} from "../constants";
import schemaBase from "../schema-base";

const schema = schemaBase.keys({
  version: Joi.number().valid(1).required(),
  type: Joi.string().valid(BUSINESS_EVENT.USER_ROLE_CHANGED),
  data: Joi.object({
    publicId: Joi.string().guid({version: ['uuidv4']}).required(),
    role: Joi.string().valid(...Object.values(POPUG_ROLES)).required()
  })
});

export default schema

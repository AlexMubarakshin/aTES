import Joi from "joi";
import {POPUG_ROLES} from "popug-shared";
import {CUD_EVENT} from "../constants";
import schemaBase from "../schema-base";

const schema = schemaBase.keys({
  version: Joi.number().valid(1).required(),
  type: Joi.string().valid(CUD_EVENT.USER_CREATED),
  data: Joi.object({
    publicId: Joi.string().guid({version: ['uuidv4']}).required(),
    role: Joi.string().valid(...Object.values(POPUG_ROLES)).required(),
    email: Joi.string().email().required(),
  })
});

export default schema

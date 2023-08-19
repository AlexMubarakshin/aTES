import Joi from "joi";
import {CUD_EVENT} from "../constants";
import schemaBase from "../schema-base";

const schema = schemaBase.keys({
  version: Joi.number().valid(1).required(),
  type: Joi.string().valid(CUD_EVENT.USER_DELETED),
  data: Joi.object({
    publicId: Joi.string().guid({version: ['uuidv4']}).required()
  })
});

export default schema

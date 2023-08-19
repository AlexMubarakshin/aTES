import Joi from 'joi'

export const schemaBase = Joi.object({
  id: Joi.string().guid({version: ['uuidv4']}).required(),
  producer: Joi.string().required(),
  time: Joi.date().required()
});

import Joi from 'joi'

const registerSchema = Joi.object({
  name: Joi.string()
    .required(),
  username: Joi.string()
    .required()
    .min(4),
  email: Joi.string()
    .required()
    .email(),
  password: Joi.string()
    .required()
    .min(6)
})

const registerValidation = (data:Object) => {
  return registerSchema.validate(data)
}

export default registerValidation
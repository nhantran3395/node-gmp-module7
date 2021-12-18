import Joi from "joi";

export const LoginRequestSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

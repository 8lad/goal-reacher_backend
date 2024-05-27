import Joi from 'joi';

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const deleteUserSchema = Joi.object({
  password: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
});

export default {
  createUserSchema,
  loginUserSchema,
  deleteUserSchema,
  updateUserSchema,
};

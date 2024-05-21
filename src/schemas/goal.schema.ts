import Joi from 'joi';

const createGoalSchema = Joi.object({
  emoji: Joi.string().required(),
  measureType: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  finalDate: Joi.date().required(),
  finalGoal: Joi.number().greater(0).required(),
  failMotivation: Joi.string(),
  successMotivation: Joi.string(),
  categoryId: Joi.number(),
});

export default {
  createGoalSchema,
};

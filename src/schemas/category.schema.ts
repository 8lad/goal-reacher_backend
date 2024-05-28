import Joi from 'joi';

const CreateCategorySchema = Joi.object({
  categoryName: Joi.string().required(),
});

const DeleteCategorySchema = Joi.object({
  categoryId: Joi.number().required(),
});

export default {
  CreateCategorySchema,
  DeleteCategorySchema,
};

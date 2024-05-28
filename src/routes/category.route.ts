import { Router } from 'express';
import { RouterPaths } from '../utils/constants';
import { verifyUser } from '../services/verifyUser';
import CategoryController from '../controllers/category.controller';
import CategorySchema from '../schemas/category.schema';
import { validateRequestBody } from '../services/validateRequestBody';

const router = Router();

router.get(RouterPaths.Categories, verifyUser, CategoryController.getAllCategories);

router.post(
  RouterPaths.Categories,
  verifyUser,
  validateRequestBody(CategorySchema.CreateCategorySchema),
  CategoryController.createSingleCategory,
);

router.delete(
  RouterPaths.Categories,
  verifyUser,
  validateRequestBody(CategorySchema.DeleteCategorySchema),
  CategoryController.deleteSingleCategory,
);

export default router;

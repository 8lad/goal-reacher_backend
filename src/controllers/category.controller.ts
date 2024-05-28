import { NextFunction, Response } from 'express';
import { CategoryRequestBody, RequestWithToken } from '../utils/types';
import CategoryRepository from '../repositories/category.repository';
import { CustomError } from '../utils/errorInstance';
import { getSuccessResponseObject } from '../utils/helpers';

const getAllCategories = async (
  req: RequestWithToken<unknown>,
  res: Response,
  next: NextFunction,
) => {
  const userId = Number(req.userId);
  try {
    const allCategories = await CategoryRepository.getAllCategories(userId);
    if (!allCategories) {
      throw new CustomError("Internal server error. Can't get all categories");
    }
    res.status(200).json(allCategories);
  } catch (error) {
    next(error);
  }
};

const createSingleCategory = async (
  req: RequestWithToken<CategoryRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const { categoryName } = req.body;
  const userId = Number(req.userId);
  try {
    const newCategory = await CategoryRepository.createSingleCategory(userId, categoryName);
    if (!newCategory) {
      throw new CustomError("Internal server error. Can't create new category");
    }

    const allCategories = await CategoryRepository.getAllCategories(userId);

    if (!allCategories) {
      throw new CustomError("Internal server error. Can't get all categories");
    }
    res.status(200).json(allCategories);
  } catch (error) {
    next(error);
  }
};

const deleteSingleCategory = async (
  req: RequestWithToken<CategoryRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const userId = Number(req.userId);
  const { categoryId } = req.body;
  try {
    const deletedCategory = await CategoryRepository.deleteSingleCategory(userId, categoryId);
    if (!deletedCategory) {
      throw new CustomError("Internal server error. Can't delete the category");
    }
    res.status(200).json(getSuccessResponseObject('The category was deleted'));
  } catch (error) {
    next(error);
  }
};

export default {
  getAllCategories,
  createSingleCategory,
  deleteSingleCategory,
};

import { Response, Request, NextFunction } from 'express';
import { GoalStatus } from '@prisma/client';
import { GoalRequestBody, RequestWithToken, SingleGoalRequest } from '../utils/types';
import { getSuccessResponseObject } from '../utils/helpers';
import GoalRepository from '../repositories/goal.repository';
import { CustomError } from '../utils/errorInstance';

const createGoal = async (
  req: RequestWithToken<GoalRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newGoalData = {
      ...req.body,
      status: GoalStatus.PENDING,
      userId: Number(req.userId),
    };
    const newGoal = await GoalRepository.createGoal(newGoalData);
    if (!newGoal) {
      throw new CustomError("Internal server error. Couldn't create a new goal");
    }
    res.status(200).json(newGoal);
  } catch (error) {
    next(error);
  }
};

const deleteGoal = async (req: Request, res: Response, next: NextFunction) => {
  const goalId = req.params.id;

  try {
    const deletedGoal = await GoalRepository.deleteGoal(Number(goalId));
    if (!deletedGoal) {
      throw new CustomError("Not found. Can't found current goal", 404);
    }

    res.status(200).json(getSuccessResponseObject('The goal was deleted'));
  } catch (error) {
    next(error);
  }
};

const getAllGoals = async (req: RequestWithToken<unknown>, res: Response, next: NextFunction) => {
  const userId = Number(req.userId);
  const queryParams = req.query;
  try {
    const allGoals = await GoalRepository.getUserGoals(userId, queryParams);
    if (!allGoals) {
      throw new CustomError("Not found. Can't find any goals", 404);
    }
    res.status(200).json(allGoals);
  } catch (error) {
    next(error);
  }
};

const getSingleGoal = async (req: RequestWithToken<unknown>, res: Response, next: NextFunction) => {
  const goalId = Number(req.params.id);

  try {
    const singleGoal = await GoalRepository.getSingleGoal(goalId, Number(req.userId));
    res.status(200).json(singleGoal);
  } catch (error) {
    next(error);
  }
};

const updateSingleGoal = async (
  req: SingleGoalRequest<GoalRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const userId = Number(req.userId);
  const goalId = Number(req.params.id);
  const newGoalData = {
    userId,
    ...req.body,
  };
  try {
    const updatedGoal = await GoalRepository.updateSingleGoal(goalId, newGoalData);
    res.status(200).json(updatedGoal);
  } catch (error) {
    next(error);
  }
  return;
};

export default {
  createGoal,
  deleteGoal,
  getAllGoals,
  getSingleGoal,
  updateSingleGoal,
};

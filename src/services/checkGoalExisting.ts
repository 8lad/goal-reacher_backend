import { Response, NextFunction } from 'express';
import GoalRepository from '../repositories/goal.repository';
import { RequestWithToken } from '../utils/types';
import { CustomError } from '../utils/errorInstance';

export const checkGoalExisting = async (
  req: RequestWithToken<unknown>,
  res: Response,
  next: NextFunction,
) => {
  const goalId = req.params.id;

  if (!goalId || isNaN(Number(goalId))) {
    next(new CustomError('Bad request. Invalid goal id'));
  }

  try {
    const singleGoal = await GoalRepository.getSingleGoal(Number(goalId), Number(req.userId));
    if (!singleGoal) {
      throw new CustomError("Not found. This goal doesn't exist", 404);
    }
    next();
  } catch (error) {
    next(error);
  }
};

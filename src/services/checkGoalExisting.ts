import { Response, NextFunction } from 'express';
import { getErrorResponseObject } from '../utils/helpers.ts';
import GoalRepository from '../repositories/goal.repository.ts';
import { RequestWithToken } from '../utils/types.ts';

export const checkGoalExisting = async (
  req: RequestWithToken<unknown>,
  res: Response,
  next: NextFunction,
) => {
  const goalId = req.params.id;

  if (!goalId || isNaN(Number(goalId))) {
    res.status(400).json(getErrorResponseObject('Bad request. Invalid goal id'));
    return;
  }
  try {
    const singleGoal = await GoalRepository.getSingleGoal(Number(goalId), Number(req.userId));
    if (!singleGoal) {
      res.status(404).json(getErrorResponseObject("Not found. This goal doesn't exist"));
      return;
    }
    next();
  } catch (error) {
    res.status(500).json(getErrorResponseObject('Internal server error. Single goal error'));
  }
};

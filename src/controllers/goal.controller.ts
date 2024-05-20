import { Response } from 'express';
import { GoalInput, GoalRequestBody, RequestWithToken } from '../utils/types.ts';
import { getErrorResponseObject } from '../utils/helpers.ts';
import GoalRepository from '../repositories/goal.repository.ts';

const createGoal = async (req: RequestWithToken<GoalRequestBody>, res: Response) => {
  if (!Object.keys(req.body).length) {
    res.status(400).json(getErrorResponseObject('Bad request. Empty input fields'));
  }
  try {
    const newGoalData = {
      ...req.body,
      userId: Number(req.userId!),
    };
    await GoalRepository.createGoal(newGoalData as GoalInput);
  } catch (error) {
    res.status(400).json(getErrorResponseObject('Bad request. Input data invalid'));
  }
};

export default {
  createGoal,
};

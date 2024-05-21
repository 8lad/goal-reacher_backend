import { Response } from 'express';
import { GoalInput, GoalRequestBody, RequestWithToken, GoalStatus } from '../utils/types.ts';
import { getErrorResponseObject } from '../utils/helpers.ts';
import GoalRepository from '../repositories/goal.repository.ts';

const createGoal = async (req: RequestWithToken<GoalRequestBody>, res: Response) => {
  try {
    const newGoalData = {
      ...req.body,
      status: GoalStatus.PENDING,
      userId: Number(req.userId),
    };
    const newGoal = await GoalRepository.createGoal(newGoalData as GoalInput);
    res.status(200).json(newGoal);
  } catch (error) {
    res
      .status(500)
      .json(getErrorResponseObject("Internal server error. Couldn't create a new goal"));
  }
};

export default {
  createGoal,
};

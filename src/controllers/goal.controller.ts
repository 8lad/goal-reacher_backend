import { Response, Request } from 'express';
import { GoalRequestBody, RequestWithToken, GoalStatus } from '../utils/types.ts';
import { getErrorResponseObject, getSuccessResponseObject } from '../utils/helpers.ts';
import GoalRepository from '../repositories/goal.repository.ts';

const createGoal = async (req: RequestWithToken<GoalRequestBody>, res: Response) => {
  try {
    const newGoalData = {
      ...req.body,
      status: GoalStatus.PENDING,
      userId: Number(req.userId),
    };
    const newGoal = await GoalRepository.createGoal(newGoalData);
    res.status(200).json(newGoal);
  } catch (error) {
    res
      .status(500)
      .json(getErrorResponseObject("Internal server error. Couldn't create a new goal"));
  }
};

const deleteGoal = async (req: Request, res: Response) => {
  const goalId = req.params.id;
  if (!goalId || isNaN(Number(goalId))) {
    res.status(400).json(getErrorResponseObject("Bad request. Can't identify goal"));
    return;
  }

  try {
    const deletedGoal = await GoalRepository.deleteGoal(Number(goalId));
    if (!deletedGoal) {
      res.status(404).json(getErrorResponseObject("Not found. Can't found current goal"));
      return;
    }

    res.status(200).json(getSuccessResponseObject('The goal was deleted'));
  } catch (error) {
    res.status(500).json(getErrorResponseObject("Internal server error. Couldn't delete a goal"));
  }
};

export default {
  createGoal,
  deleteGoal,
};

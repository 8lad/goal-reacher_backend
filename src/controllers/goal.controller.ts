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

const getAllGoals = async (req: RequestWithToken<unknown>, res: Response) => {
  const userId = Number(req.userId);
  try {
    const allGoals = await GoalRepository.getUserGoals(userId);
    if (!allGoals) {
      res.status(404).json(getErrorResponseObject("Not found. Can't find any goals"));
      return;
    }
    res.status(200).json(allGoals);
  } catch (error) {
    res
      .status(500)
      .json(getErrorResponseObject("Internal server error. Can't get all goals for the user"));
  }
};

const getSingleGoal = async (req: RequestWithToken<unknown>, res: Response) => {
  const goalId = Number(req.params.id);

  try {
    const singleGoal = await GoalRepository.getSingleGoal(goalId, Number(req.userId));
    res.status(200).json(singleGoal);
  } catch (error) {
    res.status(500).json(getErrorResponseObject("Internal server error. Can't get curren goal"));
  }
};

export default {
  createGoal,
  deleteGoal,
  getAllGoals,
  getSingleGoal,
};

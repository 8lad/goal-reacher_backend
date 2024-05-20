import { Response } from 'express';
import { GoalRequestBody, RequestWithToken } from '../utils/types.ts';
import { getErrorResponseObject } from '../utils/helpers.ts';

const createGoal = async (req: RequestWithToken<GoalRequestBody>, res: Response) => {
  if (!Object.keys(req.body).length) {
    res.status(400).json(getErrorResponseObject('Bad request. Empty input fields'));
  }
};

export default {
  createGoal,
};

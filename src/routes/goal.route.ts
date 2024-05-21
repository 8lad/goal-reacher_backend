import { Router } from 'express';
import { RouterPaths } from '../utils/constants.ts';
import GoalController from '../controllers/goal.controller.ts';
import { verifyUser } from '../services/verifyUser.ts';
import { validateRequestBody } from '../services/validateRequestBody.ts';
import GoalSchema from '../schemas/goal.schema.ts';

const router = Router();

router.post(
  RouterPaths.Goals,
  verifyUser,
  validateRequestBody(GoalSchema.createGoalSchema),
  GoalController.createGoal,
);

router.delete(RouterPaths.SingleGoal, verifyUser, GoalController.deleteGoal);

export default router;

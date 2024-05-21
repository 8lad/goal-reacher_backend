import { Router } from 'express';
import { RouterPaths } from '../utils/constants.ts';
import GoalController from '../controllers/goal.controller.ts';
import { verifyUser } from '../services/verifyUser.ts';
import { validateRequestBody } from '../services/validateRequestBody.ts';
import GoalSchema from '../schemas/goal.schema.ts';
import { checkGoalExisting } from '../services/checkGoalExisting.ts';

const router = Router();

router.post(
  RouterPaths.Goals,
  verifyUser,
  validateRequestBody(GoalSchema.createGoalSchema),
  GoalController.createGoal,
);

router.delete(RouterPaths.SingleGoal, verifyUser, checkGoalExisting, GoalController.deleteGoal);

router.get(RouterPaths.Goals, verifyUser, GoalController.getAllGoals);

router.get(RouterPaths.SingleGoal, verifyUser, checkGoalExisting, GoalController.getSingleGoal);

export default router;

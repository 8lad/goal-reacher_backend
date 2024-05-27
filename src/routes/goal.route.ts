import { Router } from 'express';
import { RouterPaths } from '../utils/constants';
import GoalController from '../controllers/goal.controller';
import { verifyUser } from '../services/verifyUser';
import { validateRequestBody } from '../services/validateRequestBody';
import GoalSchema from '../schemas/goal.schema';
import { checkGoalExisting } from '../services/checkGoalExisting';

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

router.patch(
  RouterPaths.SingleGoal,
  verifyUser,
  checkGoalExisting,
  validateRequestBody(GoalSchema.updateGoalSchema),
  GoalController.updateSingleGoal,
);

export default router;

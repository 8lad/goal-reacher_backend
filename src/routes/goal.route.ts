import { Router } from 'express';
import { RouterPaths } from '../utils/constants.ts';
import GoalController from '../controllers/goal.controller.ts';
import { verifyUser } from '../services/verifyUser.ts';

const router = Router();

router.post(RouterPaths.CreateGoal, verifyUser, GoalController.createGoal);

export default router;

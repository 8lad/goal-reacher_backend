import { Router } from 'express';
import { RouterPaths } from '../utils/constants.ts';

const router = Router();

router.post(RouterPaths.CreateGoal);

export default router;

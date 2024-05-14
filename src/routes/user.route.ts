import { Router } from 'express';
import UserController from '../controllers/user.controller.ts';
import { RouterPaths } from '../utils/constants.ts';

const router = Router();

router.post(RouterPaths.Register, UserController.createUser);
router.post(RouterPaths.Login, UserController.loginUser);

export default router;

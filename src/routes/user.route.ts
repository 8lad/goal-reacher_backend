import { Router } from 'express';
import UserController from '../controllers/user.controller.ts';
import { RouterPaths } from '../utils/constants.ts';
import { verifyUser } from '../services/verifyUser.ts';

const router = Router();

router.post(RouterPaths.Register, UserController.createUser);
router.post(RouterPaths.Login, UserController.loginUser);
router.get(RouterPaths.Logout, verifyUser, UserController.logoutUser);
router.patch(RouterPaths.DeleteUser, verifyUser, UserController.deleteUser);
router.patch(RouterPaths.UpdateUser, verifyUser, UserController.updateUser);

export default router;

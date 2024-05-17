import { Router } from 'express';
import UserController from '../controllers/user.controller.ts';
import { RouterPaths } from '../utils/constants.ts';
import { verifyUser } from '../services/verifyUser.ts';
import { checkPassword } from '../services/checkPassword.ts';

const router = Router();

router.post(RouterPaths.Register, UserController.createUser);

router.post(RouterPaths.Login, checkPassword, UserController.loginUser);

router.get(RouterPaths.Logout, verifyUser, UserController.logoutUser);

router.patch(RouterPaths.DeleteUser, verifyUser, checkPassword, UserController.deleteUser);

router.patch(RouterPaths.UpdateUser, verifyUser, checkPassword, UserController.updateUser);

export default router;

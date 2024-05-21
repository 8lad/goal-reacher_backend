import { Router } from 'express';
import UserController from '../controllers/user.controller.ts';
import { RouterPaths } from '../utils/constants.ts';
import { verifyUser } from '../services/verifyUser.ts';
import { checkPassword } from '../services/checkPassword.ts';
import { validateRequestBody } from '../services/validateRequestBody.ts';
import UserSchema from '../schemas/user.schema.ts';

const router = Router();

router.post(
  RouterPaths.Register,
  validateRequestBody(UserSchema.createUserSchema),
  UserController.createUser,
);

router.post(
  RouterPaths.Login,
  validateRequestBody(UserSchema.loginUserSchema),
  checkPassword,
  UserController.loginUser,
);

router.get(RouterPaths.Logout, verifyUser, UserController.logoutUser);

router.patch(
  RouterPaths.DeleteUser,
  verifyUser,
  validateRequestBody(UserSchema.deleteUserSchema),
  checkPassword,
  UserController.deleteUser,
);

router.patch(
  RouterPaths.UpdateUser,
  verifyUser,
  validateRequestBody(UserSchema.updateUserSchema),
  checkPassword,
  UserController.updateUser,
);

export default router;

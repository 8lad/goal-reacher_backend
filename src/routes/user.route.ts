import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { RouterPaths } from '../utils/constants';
import { verifyUser } from '../services/verifyUser';
import { checkPassword } from '../services/checkPassword';
import { validateRequestBody } from '../services/validateRequestBody';
import UserSchema from '../schemas/user.schema';

const router = Router();

router.post(
  RouterPaths.Register,
  validateRequestBody(UserSchema.createUserSchema),
  UserController.createUser,
);

router.post(
  RouterPaths.Login,
  validateRequestBody(UserSchema.loginUserSchema),
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

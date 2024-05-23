import { NextFunction, Response } from 'express';
import bcrypt from 'bcrypt';
import { RequestWithToken, UserRequestBody } from '../utils/types';
import { createSelectDatabaseObject } from '../utils/helpers';
import userRepository from '../repositories/user.repository';
import { CustomError } from '../utils/errorInstance';

export const checkPassword = async (
  req: RequestWithToken<UserRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  const userId = Number(req.userId);

  if (!email && !req.userId) {
    next(new CustomError('User not found', 404));
  }

  try {
    const userSelectObject = createSelectDatabaseObject(['email', 'password']);
    const currentUser = await userRepository.getExistingUser(userId || email, userSelectObject);

    if (!currentUser) {
      throw new CustomError('User not found', 404);
    }

    bcrypt.compare(password, currentUser.password, (error, result) => {
      if (error) {
        next(new CustomError('Internal server error. Password validation', 500));
      }
      if (result) {
        next();
        return;
      }
      next(new CustomError('Bed request. Wrong password', 400));
    });
  } catch (error) {
    next(error);
  }
};

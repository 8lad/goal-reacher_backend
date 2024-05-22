import { NextFunction, Response } from 'express';
import bcrypt from 'bcrypt';
import { RequestWithToken, UserRequestBody } from '../utils/types';
import { createSelectDatabaseObject, getErrorResponseObject } from '../utils/helpers';
import userRepository from '../repositories/user.repository';

export const checkPassword = async (
  req: RequestWithToken<UserRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  const userId = Number(req.userId);

  if (!email && !req.userId) {
    res.status(400).json(getErrorResponseObject('User not found'));
    return;
  }

  try {
    const userSelectObject = createSelectDatabaseObject(['email', 'password']);
    const currentUser = await userRepository.getExistingUser(userId || email, userSelectObject);

    if (!currentUser) {
      res.status(400).json(getErrorResponseObject('User not found'));
      return;
    }

    bcrypt.compare(password, currentUser.password, (error, result) => {
      if (error) {
        res.status(500).json(getErrorResponseObject('Internal server error. Password validation'));
        return;
      }
      if (result) {
        next();
        return;
      }
      res.status(400).json(getErrorResponseObject('Bed request. Wrong password'));
      return;
    });
  } catch (error) {
    res.status(500).json(getErrorResponseObject('Internal server error. Checking password error'));
  }
};

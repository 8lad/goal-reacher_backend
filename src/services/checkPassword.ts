import { UserRequestWithToken } from '../utils/types.ts';
import { NextFunction, Response } from 'express';
import bcrypt from 'bcrypt';
import { createSelectDatabaseObject, getErrorResponseObject } from '../utils/helpers.ts';
import userRepository from '../repositories/user.repository.ts';

export const checkPassword = async (
  req: UserRequestWithToken,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json(getErrorResponseObject('Bad request. Empty input fields'));
    return;
  }

  try {
    const userSelectObject = createSelectDatabaseObject(['email', 'password']);
    const currentUser = await userRepository.getExistingUser(email, userSelectObject);

    if (!currentUser) {
      res.status(400).json(getErrorResponseObject('User not found'));
      return;
    }

    bcrypt.compare(password, currentUser.password, (error, result) => {
      if (error) {
        res.status(500).json(getErrorResponseObject('Internal server error'));
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
    res.status(500).json(getErrorResponseObject('Internal server error'));
  }
};

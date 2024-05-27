import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRequestBody, RequestWithToken, CustomRequest } from '../utils/types';
import { getSuccessResponseObject } from '../utils/helpers';
import UserRepository from '../repositories/user.repository';
import { SALT } from '../utils/constants';
import { CustomError } from '../utils/errorInstance';

const createUser = async (
  req: CustomRequest<Omit<UserRequestBody, 'isDeleted'>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserRepository.getExistingUser(email);

    if (existingUser && existingUser.isDeleted) {
      throw new CustomError('This account was deleted', 403);
    }

    if (existingUser) {
      throw new CustomError('User already exists', 403);
    }

    bcrypt.hash(password, SALT, async (error, hash) => {
      if (error || !hash) {
        next(new CustomError('Hashing password issue', 500));
        return;
      }

      const newUserData = { name, email, password: hash };
      const newUser = await UserRepository.createUser(newUserData);
      if (!newUser) {
        next(new CustomError("Internal server error. Can't create new user", 500));
        return;
      }
      res.status(201).json(getSuccessResponseObject('User created'));
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (
  req: CustomRequest<UserRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  try {
    const user = await UserRepository.getExistingUser(email);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    if (user.isDeleted) {
      throw new CustomError('This account was deleted', 403);
    }

    bcrypt.compare(password, user.password, (error, response) => {
      if (error) {
        next(new CustomError('Password uncoding issue', 500));
        return;
      }
      if (response) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
          expiresIn: '1h',
        });

        res.cookie('token', token, { secure: true, httpOnly: true });
        res.status(200).json(getSuccessResponseObject('Login success'));
        return;
      }
      next(new CustomError('Bad request. Password is not matched', 403));
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('token');
    res.status(200).json(getSuccessResponseObject('Loguout success'));
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (
  req: RequestWithToken<UserRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await UserRepository.deleteUser(req.userId!);
    res.clearCookie('token');
    res.status(200).json(getSuccessResponseObject('User deleted'));
  } catch (error) {
    next(error);
  }
};

const updateUser = async (
  req: RequestWithToken<UserRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.body;
  const userId = Number(req.userId);
  try {
    const user = await UserRepository.updateUser(userId, name);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    res.status(200).json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    next(error);
  }
};

export default {
  createUser,
  loginUser,
  logoutUser,
  deleteUser,
  updateUser,
};

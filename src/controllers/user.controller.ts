import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRequestBody, RequestWithToken, CustomRequest } from '../utils/types.ts';
import { getErrorResponseObject, getSuccessResponseObject } from '../utils/helpers.ts';
import UserRepository from '../repositories/user.repository.ts';
import { SALT } from '../utils/constants.ts';

const createUser = async (
  req: CustomRequest<Omit<UserRequestBody, 'isDeleted'>>,
  res: Response,
) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserRepository.getExistingUser(email);

    if (existingUser && existingUser.isDeleted) {
      return res.status(400).json(getErrorResponseObject('This account was deleted'));
    }

    if (existingUser) {
      return res.status(400).json(getErrorResponseObject('User already exists'));
    }

    bcrypt.hash(password, SALT, async (error, hash) => {
      if (error) {
        return res.status(400).json(getErrorResponseObject('Hashing password issue'));
      }

      const newUserData = { name, email, password: hash };
      await UserRepository.createUser(newUserData);

      res.status(201).json(getSuccessResponseObject('User created'));
    });
  } catch (error) {
    res.status(500).json(getErrorResponseObject('Registration error. Try again later'));
  }
};

const loginUser = async (req: CustomRequest<UserRequestBody>, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await UserRepository.getExistingUser(email);
    if (!user) {
      res.status(400).json(getErrorResponseObject('User not found'));
      return;
    }

    if (user.isDeleted) {
      res.status(400).json(getErrorResponseObject('This account was deleted'));
      return;
    }

    bcrypt.compare(password, user.password, (error, response) => {
      if (error) {
        res.status(500).json(getErrorResponseObject('Password uncoding issue'));
        return;
      }
      if (response) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
          expiresIn: '1h',
        });
        res.cookie('token', token, { secure: true });
        //TODO Update option for cookie when is ready to deploy on the real server {httpOnly: true}
        res.status(200).json(getSuccessResponseObject('Login success'));
        return;
      }
      res.status(400).json(getErrorResponseObject('Password is not matched'));
    });
  } catch (error) {
    res.status(400).json(getErrorResponseObject('Can`t find the exact user'));
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token');
    res.status(200).json(getSuccessResponseObject('Loguout success'));
  } catch (error) {
    res.status(500).json(getErrorResponseObject('Logout error'));
  }
};

const deleteUser = async (req: RequestWithToken<UserRequestBody>, res: Response) => {
  try {
    await UserRepository.deleteUser(req.userId!);
    res.clearCookie('token');
    res.status(200).json(getSuccessResponseObject('User deleted'));
  } catch (error) {
    res.status(500).json(getErrorResponseObject('Delete user error'));
  }
};

const updateUser = async (req: RequestWithToken<UserRequestBody>, res: Response) => {
  const { name } = req.body;
  const userId = Number(req.userId);
  try {
    const user = await UserRepository.updateUser(userId, name);
    if (!user) {
      res.status(400).json(getErrorResponseObject('User not found'));
      return;
    }
    res.status(200).json(getSuccessResponseObject('User data updated'));
  } catch (error) {
    res.status(500).json(getErrorResponseObject('Update user error'));
  }
};

export default {
  createUser,
  loginUser,
  logoutUser,
  deleteUser,
  updateUser,
};

import { Response, Request } from 'express';
import { prisma } from '../server.ts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRequestBody, UserRequestWithToken } from '../utils/types.ts';
import { getErrorResponseObject, getSuccessResponseObject } from '../utils/helpers.ts';
import UserRepository from '../repositories/user.repository.ts';

const salt = 10;

const createUser = async (req: UserRequestBody, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!password || !email || !name) {
      res.status(400).json(getErrorResponseObject('Bad request. Empty fields detected'));
      return;
    }

    bcrypt.hash(password, salt, async (error, hash) => {
      if (error) {
        return res.status(500).json(getErrorResponseObject('Hashing password issue'));
      }
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (existingUser) {
        return res.status(500).json(getErrorResponseObject('User already exists'));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newUser = await UserRepository.createUser({
        name,
        email,
        password: hash,
      });
      res.status(200).json(getSuccessResponseObject('User created'));
    });
  } catch (error) {
    res.status(500).json(getErrorResponseObject('Registration error. Try again later'));
  }
};

const loginUser = async (req: UserRequestBody, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
      select: {
        password: true,
        email: true,
        name: true,
        id: true,
      },
    });
    if (!user) {
      res.status(500).json(getErrorResponseObject('User not found'));
      return;
    }
    const requestPassword = req.body.password;

    if (!requestPassword) {
      res.status(400).json(getErrorResponseObject('Bad request. Empty password field'));
      return;
    }

    bcrypt.compare(requestPassword, user.password, (error, response) => {
      if (error) {
        res.status(500).json(getErrorResponseObject('Password uncoding issue'));
        return;
      }
      if (response) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
          expiresIn: '1h',
        });
        res.cookie('token', token, { secure: true });
        //TODO Update option for cookie when is ready to deploy on the real server {httpOnly: true} + add redirection
        res.status(200).json(getSuccessResponseObject('Login success'));
        return;
      }
      res.status(500).json(getErrorResponseObject('Password is not matched'));
    });
  } catch (error) {
    res.status(500).json(getErrorResponseObject('Can`t find the exact user'));
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

const deleteUser = async (req: UserRequestWithToken, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deletedUser = await prisma.user.update({
      where: {
        email: req.body.email,
      },
      data: {
        isDeleted: true,
      },
    });
    res.clearCookie('token');
    res.status(200).json(getSuccessResponseObject('User deleted'));
  } catch (error) {
    res.status(500).json(getErrorResponseObject('Delete user error'));
  }
};

const updateUser = async (req: UserRequestWithToken, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: {
        email: req.body.email,
      },
      data: {
        name: req.body.name,
      },
    });
    if (!user) {
      res.status(500).json(getErrorResponseObject('User not found'));
      return;
    }
    res.status(200).json(req.cookies);
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

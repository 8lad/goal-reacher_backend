import { Response, Request } from 'express';
import { prisma } from '../server.ts';
import jwt from 'jsonwebtoken';
// import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';

const salt = 10;

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    bcrypt.hash(password.toString(), salt, async (error, hash) => {
      if (error) {
        return res.json({ error: 'Hashing password issue' });
      }
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (existingUser) {
        return res.status(500).json({ error: 'User already exists' });
      }
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hash,
        },
      });
      res.status(200).json(newUser);
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration error. Try again later' });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
      select: {
        password: true,
        email: true,
        name: true,
      },
    });
    if (!user) {
      res.status(500).json({ error: 'User not founded' });
      return;
    }
    const requestPassword = req.body.password.toString();
    bcrypt.compare(requestPassword, user.password, (error, response) => {
      if (error) {
        res.status(500).json({ error: 'Password uncoding issue' });
        return;
      }
      if (response) {
        const token = jwt.sign({ email: user.email }, 'secret-key', {
          expiresIn: '1h',
        });
        console.log(process.env.JWT_SECRET as string);
        res.cookie('token', token);
        res.status(200).json({ message: 'Token success', token });
        return;
      }
      res.status(500).json({ error: 'Password is not matched' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Can`t find the exact user' });
  }
};

export default {
  createUser,
  loginUser,
};

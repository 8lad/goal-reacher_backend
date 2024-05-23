import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { GoalRequestBody, RequestWithToken, UserRequestBody } from '../utils/types';
import { CustomError } from '../utils/errorInstance';

export const verifyUser = (
  req: RequestWithToken<UserRequestBody | GoalRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    next(new CustomError('Unauthorized', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (!decoded.id) {
      throw new CustomError('Bad request. Authorization issue', 400);
    }
    req.userId = decoded.id;
    next();
  } catch (error) {
    next(error);
  }
};

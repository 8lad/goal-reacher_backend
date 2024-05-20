import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getErrorResponseObject } from '../utils/helpers.ts';
import { RequestWithToken, UserRequestBody } from '../utils/types.ts';

export const verifyUser = (
  req: RequestWithToken<UserRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json(getErrorResponseObject('Unauthorized'));
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (!decoded.id) {
      res.status(400).json(getErrorResponseObject('Bad request. Authorization issue'));
      return;
    }
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(500).json(getErrorResponseObject('Token error'));
  }
};

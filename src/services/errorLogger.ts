import { Request, Response, NextFunction } from 'express';

export const errorLogger = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error) {
    console.error(error.stack);
    next(error);
  }
};

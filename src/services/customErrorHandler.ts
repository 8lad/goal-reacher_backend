import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/errorInstance';

export const customErrorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errorResponseObject = {
    message: error.message,
    status: error.status || 'error',
  };
  res.status(error.statusCode || 500).json(errorResponseObject);
  next();
};

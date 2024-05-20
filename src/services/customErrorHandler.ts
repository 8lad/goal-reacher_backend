import { Request, Response, NextFunction } from 'express';

export const customErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const responseBody = {
    message: error.message,
    stack: error.stack,
  };

  console.error('Error: ', responseBody);
  res.status(statusCode).json(responseBody);
  next();
};

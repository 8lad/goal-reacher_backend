import { Request, Response, NextFunction } from 'express';

export const errorLogger = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(
    `*** Error detected ***
*** Message: ${error.message} ***
*** Stack: ${error.stack} ***`,
  );
  next(error);
};

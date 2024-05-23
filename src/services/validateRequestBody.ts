import { NextFunction, Request, Response } from 'express';
import { AnySchema } from 'joi';
import { CustomError } from '../utils/errorInstance';

export const validateRequestBody = (schema: AnySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        throw new CustomError(error.details[0].message, 400);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

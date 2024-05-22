import { NextFunction, Request, Response } from 'express';
import { AnySchema } from 'joi';
import { getErrorResponseObject } from '../utils/helpers';

export const validateRequestBody = (schema: AnySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        res.status(400).json(getErrorResponseObject(error.details[0].message));
        return;
      }
      next();
    } catch (error) {
      res
        .status(500)
        .json(getErrorResponseObject('Internal server error. Validation request body'));
    }
  };
};

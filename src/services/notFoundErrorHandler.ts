import { Response, Request } from 'express';
import { getErrorResponseObject } from '../utils/helpers';

export const notFoundErrorHandler = (req: Request, res: Response) => {
  res.status(404).json(getErrorResponseObject('Page not found'));
};

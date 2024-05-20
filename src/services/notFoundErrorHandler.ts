import { Response, Request } from 'express';

export const notFoundErrorHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
};

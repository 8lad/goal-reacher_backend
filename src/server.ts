import express, { Response, Request, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import UserRouter from './routes/user.route.ts';
import GoalRouter from './routes/goal.route.ts';
import { getErrorResponseObject } from './utils/helpers.ts';
import { REQUESTS_AMOUNT_LIMIT, REQUESTS_TIME_LIMIT } from './utils/constants.ts';

const app = express();
export const prisma = new PrismaClient();

const main = async () => {
  app.use(express.json());

  app.use(cookieParser());

  app.use(helmet({ xDownloadOptions: false }));

  app.use(
    rateLimit({
      windowMs: REQUESTS_TIME_LIMIT,
      limit: REQUESTS_AMOUNT_LIMIT,
      message: getErrorResponseObject('Reach the request limit'),
      statusCode: 400,
    }),
  );

  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
    }),
  );

  app.use(process.env.BASE_ROUTE as string, UserRouter);
  app.use(process.env.BASE_ROUTE as string, GoalRouter);

  app.all('*', (req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack);
    res.status(500).json({ error: 'Internal server error' });
    next();
  });

  app.listen(process.env.SERVER_PORT, () => {
    console.info(`Server runs on the ${process.env.SERVER_PORT} port`);
  });
};

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

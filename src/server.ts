import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import UserRouter from './routes/user.route';
import GoalRouter from './routes/goal.route';
import { getErrorResponseObject } from './utils/helpers';
import { REQUESTS_AMOUNT_LIMIT, REQUESTS_TIME_LIMIT } from './utils/constants';
import { customErrorHandler } from './services/customErrorHandler';
import { notFoundErrorHandler } from './services/notFoundErrorHandler';
import { checkAllEnv } from './utils/checkAllEnv';
import { isDevMode } from './utils/isDevMode';
import { errorLogger } from './services/errorLogger';
import cron from 'node-cron';

checkAllEnv();

const app = express();
export const prisma = new PrismaClient();
const originUrl = isDevMode() ? '*' : process.env.ORIGIN_URL;

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
      origin: originUrl,
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
    }),
  );

  cron.schedule(' */1 * * * *', () => {
    console.info('Cron running');
  });

  app.use(process.env.BASE_ROUTE!, UserRouter);
  app.use(process.env.BASE_ROUTE!, GoalRouter);

  if (isDevMode()) {
    app.use(errorLogger);
  }

  app.all('*', notFoundErrorHandler);
  app.use(customErrorHandler);

  app.listen(process.env.SERVER_PORT || 3000, () => {
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

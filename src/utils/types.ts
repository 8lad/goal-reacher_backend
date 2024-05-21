import { GoalMeasure, Prisma } from '@prisma/client';
import { Request } from 'express';

export type RequireExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>;
export interface UserRequestBody {
  name: string;
  password: string;
  isDeleted: boolean;
  email: string;
}

export interface CustomRequest<T> extends Request {
  body: T;
}
export interface RequestWithToken<T> extends Request {
  userId?: string;
  body: T;
}

export enum UserResponseStatus {
  Error = 'error',
  Success = 'success',
}

export interface UserResponseObject {
  message: string;
  status: UserResponseStatus;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export type UserSelectedFields = {
  [key in keyof Prisma.UserSelect]?: boolean;
};
export interface UserQuerySelect {
  where: Prisma.UserWhereUniqueInput;
  select?: UserSelectedFields;
}

export interface GoalRequestBody {
  emoji: string;
  measureType: GoalMeasure;
  title: string;
  content: string;
  finalDate: string;
  progress: number;
  finalGoal: number;
  failMotivation?: string;
  successMotivation?: string;
  categoryId?: number;
  status?: GoalStatus;
}

export interface GoalInput extends GoalRequestBody {
  userId: number;
}

export enum GoalStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

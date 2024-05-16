import { Request } from 'express';

export interface UserRequestBody extends Request {
  body: {
    name?: string;
    password?: string;
    isDeleted?: boolean;
    email?: string;
  };
}

export interface UserRequestWithToken extends UserRequestBody {
  userId?: string;
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

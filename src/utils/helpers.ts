import { UserResponseObject, UserResponseStatus } from './types.ts';

export const getErrorResponseObject = (message: string): UserResponseObject => {
  return { message, status: UserResponseStatus.Error };
};

export const getSuccessResponseObject = (message: string): UserResponseObject => {
  return { message, status: UserResponseStatus.Success };
};

export const createSelectDatabaseObject = (fields: string[]) => {
  return fields.reduce((acc, item) => {
    return {
      ...acc,
      [item]: true,
    };
  }, {});
};

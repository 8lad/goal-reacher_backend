export enum RouterPaths {
  Register = '/register',
  Login = '/login',
  Logout = '/logout',
  DeleteUser = '/delete-user',
  UpdateUser = '/update-user',
  Dashboards = '/dashboards',
}

export const SALT = 10;
export const REQUESTS_TIME_LIMIT = 10 * 60 * 1000;
export const REQUESTS_AMOUNT_LIMIT = 100;

export enum RouterPaths {
  Register = '/users',
  Login = '/users-login',
  Logout = '/users-logout',
  DeleteUser = '/users-delete',
  UpdateUser = '/users-update',
  Dashboards = '/dashboards',
  Goals = '/goals',
  SingleGoal = '/goals/:id',
}

export const SALT = 10;
export const REQUESTS_TIME_LIMIT = 10 * 60 * 1000;
export const REQUESTS_AMOUNT_LIMIT = 100;
export const ALL_REQUIRED_ENVS = ['DATABASE_URL', 'SERVER_PORT', 'BASE_ROUTE', 'JWT_SECRET'];

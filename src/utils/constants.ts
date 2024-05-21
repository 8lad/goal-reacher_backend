export enum RouterPaths {
  Register = '/register',
  Login = '/login',
  Logout = '/logout',
  DeleteUser = '/delete-user',
  UpdateUser = '/update-user',
  Dashboards = '/dashboards',
  CreateGoal = '/create-goal/:goalId',
  UpdateGoal = '/update-goal/:goalId',
  AllGoals = '/all-goals',
}

export const SALT = 10;
export const REQUESTS_TIME_LIMIT = 10 * 60 * 1000;
export const REQUESTS_AMOUNT_LIMIT = 100;
export const ALL_REQUIRED_ENVS = ['DATABASE_URL', 'SERVER_PORT', 'BASE_ROUTE', 'JWT_SECRET'];

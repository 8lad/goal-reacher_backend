import { ALL_REQUIRED_ENVS } from './constants';

export const checkAllEnv = () => {
  const missingEnv = ALL_REQUIRED_ENVS.filter((env) => !process.env[env]);
  if (missingEnv.length > 0) {
    console.error(`Detected missed envs: ${missingEnv.join(', ')}`);
    process.exit(1);
  }
  console.info('All env detected');
};

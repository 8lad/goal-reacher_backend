export const isDevMode = () => {
  return !process.env.NODE_ENV || process.env.NODE_ENV !== 'development' ? false : true;
};

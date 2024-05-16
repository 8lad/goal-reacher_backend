import { prisma } from '../server.ts';
import { CreateUserInput } from '../utils/types.ts';

const createUser = async (data: CreateUserInput) => {
  return await prisma.user.create({
    data,
  });
};

export default {
  createUser,
};

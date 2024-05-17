import { prisma } from '../server.ts';
import { CreateUserInput, UserSelectedFields, UserQuerySelect } from '../utils/types.ts';

const createUser = async (data: CreateUserInput) => {
  return await prisma.user.create({
    data,
  });
};

const getExistingUser = async (email: string, selectObject?: UserSelectedFields) => {
  const query: UserQuerySelect = {
    where: {
      email,
    },
  };

  if (selectObject && Object.keys(selectObject).length) {
    query.select = selectObject;
  }

  return await prisma.user.findUnique(query);
};

const deleteUser = async (userId: string) =>
  await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      isDeleted: true,
    },
  });

const updateUser = async (email: string, name: string) =>
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      name,
    },
  });

export default {
  createUser,
  getExistingUser,
  deleteUser,
  updateUser,
};

import { prisma } from '../server.ts';
import { CreateUserInput, UserSelectedFields, UserQuerySelect } from '../utils/types.ts';

const createUser = async (data: CreateUserInput) => {
  return await prisma.user.create({
    data,
  });
};

const getExistingUser = async (searchParam: number | string, selectObject?: UserSelectedFields) => {
  const paramObject =
    typeof searchParam === 'string' ? { email: searchParam } : { id: searchParam };
  const query: UserQuerySelect = {
    where: {
      ...paramObject,
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

const updateUser = async (id: number, name: string) =>
  await prisma.user.update({
    where: {
      id,
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

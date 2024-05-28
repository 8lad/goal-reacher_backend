import { prisma } from '../server';

const getAllCategories = async (userId: number) => {
  return await prisma.category.findMany({
    where: {
      userId,
    },
  });
};

const createSingleCategory = async (userId: number, categoryName: string) => {
  return await prisma.category.create({
    data: {
      name: categoryName,
      userId,
    },
  });
};

const deleteSingleCategory = async (userId: number, categoryId: number) => {
  return await prisma.category.delete({
    where: {
      id: categoryId,
      userId,
    },
  });
};

export default {
  getAllCategories,
  createSingleCategory,
  deleteSingleCategory,
};

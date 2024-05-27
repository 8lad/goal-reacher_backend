import { GoalStatus, Prisma } from '@prisma/client';
import { prisma } from '../server';
import { AscDescSorting, GoalInput } from '../utils/types';

const createGoal = async (data: GoalInput) => {
  return await prisma.goal.create({
    data,
  });
};

const deleteGoal = async (goalId: number) => {
  return await prisma.goal.delete({
    where: {
      id: goalId,
    },
  });
};

const getSingleGoal = async (goalId: number, userId: number) => {
  return await prisma.goal.findUnique({
    where: {
      id: goalId,
      userId,
    },
  });
};

const getUserGoals = async (userId: number, queryParams?: Prisma.GoalWhereInput) => {
  const isTitleAscDescSorted = queryParams?.title === 'asc' || queryParams?.title === 'desc';
  const whereQueryParams = {
    ...(queryParams?.status ? { status: queryParams?.status } : {}),
    ...(queryParams?.title && !isTitleAscDescSorted
      ? { title: { contains: queryParams.title as string } }
      : {}),
  };

  const orderByQueryParams = {
    ...(queryParams?.finalDate ? { finalDate: queryParams.finalDate as AscDescSorting } : {}),
    ...(queryParams?.title && isTitleAscDescSorted
      ? { title: queryParams.title as AscDescSorting }
      : {}),
  };

  return await prisma.goal.findMany({
    where: {
      userId,
      ...whereQueryParams,
    },
    orderBy: {
      ...orderByQueryParams,
    },
  });
};

const updateSingleGoal = async (
  goalId: number,
  newData: Omit<GoalInput, 'measureType' | 'finalDate' | 'finalGoal'>,
) => {
  return await prisma.goal.update({
    where: {
      id: goalId,
    },
    data: {
      ...newData,
    },
  });
};

const getExpiredGoals = async () => {
  return await prisma.goal.findMany({
    where: {
      finalDate: {
        lte: new Date(),
      },
      status: GoalStatus.PENDING,
    },
  });
};

export default {
  createGoal,
  deleteGoal,
  getSingleGoal,
  getUserGoals,
  updateSingleGoal,
  getExpiredGoals,
};

import { prisma } from '../server';
import { GoalInput } from '../utils/types';

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

const getUserGoals = async (userId: number) => {
  return await prisma.goal.findMany({
    where: {
      userId,
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

export default {
  createGoal,
  deleteGoal,
  getSingleGoal,
  getUserGoals,
  updateSingleGoal,
};

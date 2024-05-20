import { prisma } from '../server.ts';
import { GoalInput } from '../utils/types.ts';

const createGoal = async (data: GoalInput) => {
  return await prisma.goal.create({
    data,
  });
};

export default {
  createGoal,
};

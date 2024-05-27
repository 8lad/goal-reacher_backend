import { GoalStatus } from '@prisma/client';
import { prisma } from '../server';

export const goalsPereodicUpdating = async () => {
  try {
    await prisma.$transaction(async (prisma) => {
      const allExpiredGoals = await prisma.goal.findMany({
        where: {
          finalDate: {
            lte: new Date(),
          },
          status: GoalStatus.PENDING,
        },
      });
      if (allExpiredGoals.length === 0) {
        return;
      }
      for (const goal of allExpiredGoals) {
        const newGoalStatus =
          goal.finalGoal > goal.progress ? GoalStatus.FAILED : GoalStatus.SUCCESS;
        await prisma.goal.update({
          where: {
            id: goal.id,
          },
          data: {
            status: newGoalStatus,
          },
        });
      }
    });
  } catch (error) {
    console.error(`Periodical goals updating is fallen: ${error}`);
  }
};

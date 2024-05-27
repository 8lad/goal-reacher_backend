import { GoalStatus } from '@prisma/client';
import { prisma } from '../server';
import GoalRepository from '../repositories/goal.repository';
import { GoalInput } from '../utils/types';

export const goalsPereodicUpdating = async () => {
  try {
    await prisma.$transaction(async () => {
      const allExpiredGoals = await GoalRepository.getExpiredGoals();

      if (allExpiredGoals.length === 0) {
        return;
      }
      for (const goal of allExpiredGoals) {
        const newGoalStatus =
          goal.finalGoal > goal.progress ? GoalStatus.FAILED : GoalStatus.SUCCESS;
        const newGoalData = { status: newGoalStatus } as GoalInput;

        await GoalRepository.updateSingleGoal(goal.id, newGoalData);
      }
    });
  } catch (error) {
    console.error(`Periodical goals updating is fallen: ${error}`);
  }
};

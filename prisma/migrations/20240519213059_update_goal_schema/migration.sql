/*
  Warnings:

  - You are about to drop the column `step` on the `goals` table. All the data in the column will be lost.
  - Added the required column `finalGoal` to the `goals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `goals` DROP COLUMN `step`,
    ADD COLUMN `finalGoal` INTEGER NOT NULL,
    ADD COLUMN `progress` INTEGER NOT NULL DEFAULT 0,
    MODIFY `emoji` VARCHAR(191) NULL,
    MODIFY `failMotivation` VARCHAR(191) NULL,
    MODIFY `successMotivation` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PENDING', 'FAILED', 'SUCCESS') NULL;

/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `isDeleted`,
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'User';

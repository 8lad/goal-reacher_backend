/*
  Warnings:

  - Added the required column `status` to the `goals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `goals` ADD COLUMN `status` ENUM('PENDING', 'FAILED', 'SUCCESS') NOT NULL;

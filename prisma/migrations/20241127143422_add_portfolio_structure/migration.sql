/*
  Warnings:

  - You are about to drop the column `userId` on the `pieces` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "pieces" DROP CONSTRAINT "pieces_userId_fkey";

-- AlterTable
ALTER TABLE "pieces" DROP COLUMN "userId";

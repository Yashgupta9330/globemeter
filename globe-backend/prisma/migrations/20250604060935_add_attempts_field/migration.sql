/*
  Warnings:

  - You are about to drop the column `countryId` on the `Info` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Info" DROP CONSTRAINT "Info_countryId_fkey";

-- AlterTable
ALTER TABLE "Info" DROP COLUMN "countryId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0;

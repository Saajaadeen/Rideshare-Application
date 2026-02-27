/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Add as nullable first
ALTER TABLE "User" ADD COLUMN "userId" TEXT;

-- Backfill existing rows with a unique value
UPDATE "User" SET "userId" = gen_random_uuid()::TEXT WHERE "userId" IS NULL;

-- Now make it NOT NULL and unique
ALTER TABLE "User" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "User" ADD CONSTRAINT "User_userId_key" UNIQUE ("userId");
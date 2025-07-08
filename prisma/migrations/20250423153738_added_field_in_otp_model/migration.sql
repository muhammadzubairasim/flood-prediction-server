/*
  Warnings:

  - You are about to drop the column `is_verified` on the `otp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "otp" DROP COLUMN "is_verified",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

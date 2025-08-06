-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "expertise" TEXT[] DEFAULT ARRAY[]::TEXT[];

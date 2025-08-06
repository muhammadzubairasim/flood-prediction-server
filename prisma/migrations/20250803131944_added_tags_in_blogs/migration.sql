-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

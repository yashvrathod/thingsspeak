/*
  Warnings:

  - You are about to drop the column `count` on the `rate_limits` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `rate_limits` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "rate_limits_key_expiresAt_key";

-- AlterTable
ALTER TABLE "rate_limits" DROP COLUMN "count",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE INDEX "rate_limits_key_expiresAt_idx" ON "rate_limits"("key", "expiresAt");

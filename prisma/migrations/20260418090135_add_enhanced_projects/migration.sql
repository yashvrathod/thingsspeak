-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('BASIC', 'IOT');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "code" TEXT,
ADD COLUMN     "components" TEXT[],
ADD COLUMN     "connections" TEXT[],
ADD COLUMN     "diagramUrl" TEXT,
ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'BEGINNER',
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fieldLabels" TEXT[],
ADD COLUMN     "references" TEXT[],
ADD COLUMN     "steps" TEXT[],
ADD COLUMN     "type" "ProjectType" NOT NULL DEFAULT 'BASIC',
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "working" TEXT,
ALTER COLUMN "driveLink" DROP NOT NULL;

-- CreateTable
CREATE TABLE "user_projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "channelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "bookmarks" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_projects_userId_projectId_key" ON "user_projects"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

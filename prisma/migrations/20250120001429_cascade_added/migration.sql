-- DropForeignKey
ALTER TABLE "user_projects" DROP CONSTRAINT "user_projects_projectId_fkey";

-- DropForeignKey
ALTER TABLE "user_projects" DROP CONSTRAINT "user_projects_userId_fkey";

-- AddForeignKey
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

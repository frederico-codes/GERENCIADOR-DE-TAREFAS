/*
  Warnings:

  - Made the column `description` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "task_history" DROP CONSTRAINT "task_history_task_id_fkey";

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "description" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "task_history" ADD CONSTRAINT "task_history_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

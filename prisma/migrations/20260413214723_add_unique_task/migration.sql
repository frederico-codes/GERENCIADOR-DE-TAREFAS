/*
  Warnings:

  - A unique constraint covering the columns `[title,description,assigned_to,team_id]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tasks_title_description_assigned_to_team_id_key" ON "tasks"("title", "description", "assigned_to", "team_id");

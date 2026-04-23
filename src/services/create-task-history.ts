import { prisma } from "../database/prisma";

export async function createTaskHistory(data: {
  taskId: string;
  changedBy: string;
  oldStatus: "pending" | "in_progress" | "completed";
  newStatus: "pending" | "in_progress" | "completed";
}) {
  return prisma.taskHistory.create({
    data,
  });
}
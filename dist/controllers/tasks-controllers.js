"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma_1 = require("../database/prisma");
const createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1, "O titulo da tarefa e obrigatorio."),
    description: zod_1.z.string().trim().optional(),
    priority: zod_1.z.nativeEnum(client_1.TaskPriority).optional(),
    status: zod_1.z.nativeEnum(client_1.TaskStatus).optional(),
    assignedTo: zod_1.z.string().uuid().optional(),
    teamId: zod_1.z.string().uuid().optional(),
});
const updateTaskSchema = createTaskSchema.partial();
class TasksController {
    async createTask(req, res) {
        const { title, description, priority, status, assignedTo, teamId } = createTaskSchema.parse(req.body);
        const newTask = await prisma_1.prisma.task.create({
            data: {
                title,
                description,
                priority,
                status,
                assignedTo: assignedTo ?? req.user.id,
                teamId,
            },
        });
        res.status(201).json(newTask);
    }
    async getTasks(req, res) {
        const userId = req.user.id;
        const userRole = req.user.role;
        let where = {};
        if (userRole !== "admin") {
            where = { assignedTo: userId };
        }
        const tasks = await prisma_1.prisma.task.findMany({ where });
        res.status(200).json({ tasks });
    }
    async updateTask(req, res) {
        const { id } = req.params;
        const data = updateTaskSchema.parse(req.body);
        const updatedTask = await prisma_1.prisma.task.update({
            where: { id },
            data,
        });
        res.status(200).json(updatedTask);
    }
    async deleteTask(req, res) {
        const { id } = req.params;
        await prisma_1.prisma.task.delete({
            where: { id },
        });
        res.status(200).json({ message: "Tarefa deletada com sucesso!" });
    }
    async getTaskById(req, res) {
        const { id } = req.params;
        const task = await prisma_1.prisma.task.findUnique({
            where: { id },
        });
        res.status(200).json({ task });
    }
    async getTasksByUserId(req, res) {
        const { userId } = req.params;
        const tasks = await prisma_1.prisma.task.findMany({
            where: { assignedTo: userId },
        });
        res.status(200).json({ tasks });
    }
    async getTasksByStatus(req, res) {
        const { status } = req.params;
        const parsedStatus = zod_1.z.nativeEnum(client_1.TaskStatus).parse(status);
        const tasks = await prisma_1.prisma.task.findMany({
            where: { status: parsedStatus },
        });
        res.status(200).json({ tasks });
    }
}
exports.TasksController = TasksController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUsers = getUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const bcryptjs_1 = require("bcryptjs");
const prisma_1 = require("../database/prisma");
async function createUser(req, res) {
    const { name, email, password, role } = req.body;
    const passwordHash = await (0, bcryptjs_1.hash)(password, 10);
    const newUser = await prisma_1.prisma.user.create({
        data: {
            name,
            email,
            password: passwordHash,
            role,
        },
    });
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
}
async function getUsers(req, res) {
    const users = await prisma_1.prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    res.status(200).json(users);
}
async function updateUser(req, res) {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const updatedUser = await prisma_1.prisma.user.update({
        where: { id },
        data: { name, email, password, role },
    });
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
}
async function deleteUser(req, res) {
    const { id } = req.params;
    await prisma_1.prisma.user.delete({
        where: { id },
    });
    res.status(204).send();
}

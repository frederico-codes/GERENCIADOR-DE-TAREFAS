"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsController = void 0;
const AppError_1 = require("../utils/AppError");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = require("../configs/auth");
const prisma_1 = require("../database/prisma");
const zod_1 = require("zod");
const bcryptjs_1 = require("bcryptjs");
const schema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email format" }),
    password: zod_1.z.string().min(6, { message: "Password must be at least 6 characters long" }),
});
class SessionsController {
    async create(req, res) {
        try {
            const { email, password } = schema.parse(req.body);
            const user = await prisma_1.prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new AppError_1.AppError("Invalid email or password", 401);
            }
            const passwordMatched = await (0, bcryptjs_1.compare)(password, user.password);
            if (!passwordMatched) {
                throw new AppError_1.AppError("Invalid email or password", 401);
            }
            const { secret, expiresIn } = auth_1.authConfig.jwt;
            const token = (0, jsonwebtoken_1.sign)({ role: user.role }, secret, {
                subject: user.id,
                expiresIn: expiresIn,
            });
            return res.json({ token });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.SessionsController = SessionsController;

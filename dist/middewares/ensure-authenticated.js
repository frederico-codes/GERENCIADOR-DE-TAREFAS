"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
const AppError_1 = require("../utils/AppError");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = require("../configs/auth");
function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.AppError("JWT token não informado", 401);
    }
    const [, token] = authHeader.split(" ");
    const { sub: user_id, role } = (0, jsonwebtoken_1.verify)(token, auth_1.authConfig.jwt.secret);
    req.user = {
        id: String(user_id),
        role,
    };
    return next();
}

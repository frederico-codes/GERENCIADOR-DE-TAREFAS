"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserAuthorization = verifyUserAuthorization;
const AppError_1 = require("../utils/AppError");
function verifyUserAuthorization(role) {
    return (req, res, next) => {
        if (!req.user || !role.includes(req.user.role)) {
            throw new AppError_1.AppError("Unauthorized", 403);
        }
        return next();
    };
}

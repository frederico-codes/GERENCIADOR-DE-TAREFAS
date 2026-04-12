"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandling = errorHandling;
const AppError_1 = require("../utils/AppError");
const zod_1 = require("zod");
function errorHandling(err, req, res, next) {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({ message: "Validation Error", issues: err.format() });
    }
    return res.status(500).json({ message: "Internal Server Error" });
}

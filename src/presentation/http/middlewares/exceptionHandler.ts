import type { ErrorRequestHandler } from "express";
import { logger } from "../../../shared/logger";
import {CustomError} from "../../../shared/customError";

export const exceptionHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);

    logger.error(
        {
            err,
            requestId: req.requestId ?? null,
            method: req.method,
            url: req.originalUrl,
        },
        err?.message ?? "Unhandled error"
    );

    if (err instanceof CustomError) {
        return res.status(err.status).json({
            error: { message: err.message, code: err.code },
            requestId: req.requestId ?? null,
        });
    }

    return res.status(500).json({
        error: { message: "Internal server error", code: "INTERNAL_ERROR" },
        requestId: req.requestId ?? null,
    });
};

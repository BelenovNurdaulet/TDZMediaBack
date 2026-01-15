import type { RequestHandler } from "express";
import crypto from "crypto";

export const addRequestId: RequestHandler = (req, res, next) => {
    const requestId = crypto.randomUUID();

    req.requestId = requestId;
    res.setHeader("X-Request-Id", requestId);

    next();
};

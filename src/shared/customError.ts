export class CustomError extends Error {
    status: number;
    code: string;

    constructor(message: string, status = 500, code = "APP_ERROR",
    ) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.code = code;
    }
}

export class ForbiddenError extends CustomError {
    constructor(message = "Access denied") {
        super(message, 403, "FORBIDDEN");
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message = "Authentication required") {
        super(message, 401, "UNAUTHORIZED");
    }
}

export class NotFoundError extends CustomError {
    constructor(message = "Resource not found") {
        super(message, 404, "NOT_FOUND");
    }
}

export class ConflictError extends CustomError {
    constructor(message = "Resource already exists") {
        super(message, 409, "CONFLICT");
    }
}

export class BadRequestError extends CustomError {
    constructor(message = "Invalid request") {
        super(message, 400, "BAD_REQUEST");
    }
}

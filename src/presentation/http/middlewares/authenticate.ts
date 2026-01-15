import {Request,NextFunction,Response} from "express";
import {UnauthorizedError} from "../../../shared/customError";
import {TokenManager} from "../../../application/ports/security/tokenManager";

export function buildAuthenticate(tokenManager:TokenManager) {
return async function (req: Request, _res: Response, next: NextFunction)
{
    const token: string = req.cookies?.access_token;
    if (!token) {
        throw new UnauthorizedError("Вы не авторизованы");
    }
    try {
        const payload = tokenManager.verifyAccessToken(token);

        req.user = {
            id: payload.userId,
            email: payload.email,
            role: payload.role,
        };

        return next();
    } catch {
        throw new UnauthorizedError("Вы не авторизованы");
    }
};
}
import {AccessTokenPayload, RefreshTokenPayload, TokenManager} from "../../application/ports/security/tokenManager";
import jwt from "jsonwebtoken";
import {UnauthorizedError} from "../../shared/customError";


export class JWTTokenManager implements TokenManager {
    constructor(
        private readonly config: {
            secret: string;
            accessExpiresIn: number;  // 900
            refreshExpiresIn: number; // 604800
        }) {}

    signAccessToken(params: AccessTokenPayload): string {
        return jwt.sign(
            { userId: params.userId, email: params.email, role: params.role },
            this.config.secret,
            { expiresIn: this.config.accessExpiresIn }
        );
    }

    signRefreshToken(params: { userId: number }): string {
        return jwt.sign(
            { userId: params.userId, type: "refresh_token" },
            this.config.secret,
            { expiresIn: this.config.refreshExpiresIn }
        );
    }

    verifyAccessToken(token: string): AccessTokenPayload {
        return jwt.verify(token, this.config.secret) as AccessTokenPayload;
    }

    verifyRefreshToken(token: string): RefreshTokenPayload {
        const payload= jwt.verify(token, this.config.secret) as RefreshTokenPayload;

        if (payload?.type !== "refresh_token") {
            throw new UnauthorizedError("Вы не авторизованы");
        }
        return payload;
    }
}
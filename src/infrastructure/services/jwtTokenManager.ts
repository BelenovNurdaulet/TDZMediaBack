import {AccessTokenPayload, RefreshTokenPayload, TokenManager} from "../../application/ports/security/tokenManager";
import jwt from "jsonwebtoken";


export class JWTTokenManager implements TokenManager {
    constructor(
        private readonly config: {
            secret: string;
            accessExpiresIn: number;  // "5m"
            refreshExpiresIn: number; // "7d"
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
        return jwt.verify(token, this.config.secret) as RefreshTokenPayload;
    }
}
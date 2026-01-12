import {Role} from "../../../domain/entities/User";

export type AccessTokenPayload = {
    userId: number;
    email: string;
    role: Role;
};

export type RefreshTokenPayload = {
    userId: number;
    type: "refresh_token";
};

export interface TokenManager {
    signAccessToken(params: AccessTokenPayload): string;
    signRefreshToken(params: { userId: number }): string;

    verifyAccessToken(token: string): AccessTokenPayload;
    verifyRefreshToken(token: string): RefreshTokenPayload;
}
import {BadRequestError, UnauthorizedError} from "../../../shared/customError";
import {UserRepository} from "../../ports/repositories/userRepository";
import {TokenManager} from "../../ports/security/tokenManager";

export function buildRefreshToken(userRepo: UserRepository, tokenManager: TokenManager) {
    return async function refreshToken({refreshToken}: { refreshToken: string }): Promise<{ accessToken: string, refreshToken: string }> {
        if (!refreshToken) {
            throw new UnauthorizedError("Вы не авторизованы");
        }

        const payload = tokenManager.verifyRefreshToken(refreshToken);
        if (!payload) {
            throw new UnauthorizedError("Вы не авторизованы");
        }

        const user = await userRepo.findById({id: payload.userId})
        if (!user) {
            throw new BadRequestError('Неверные данные авторизации')
        }

        const access_token = tokenManager.signAccessToken({userId: user.id, email: user.email, role: user.role})
        const refresh_token = tokenManager.signRefreshToken({userId: user.id})

        return {accessToken: access_token, refreshToken: refresh_token};
    }

}
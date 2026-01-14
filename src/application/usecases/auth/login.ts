import {UserRepository} from "../../ports/repositories/userRepository";
import {PasswordHasher} from "../../ports/security/passwordHasher";
import {BadRequestError} from "../../../shared/customError";
import {TokenManager} from "../../ports/security/tokenManager";

type LoginInput = {
    email: string;
    password: string;
}

export function builderLogin(userRepo: UserRepository, passwordHasher: PasswordHasher, tokenManager: TokenManager) {
    return async function login({email, password}: LoginInput): Promise<{ accessToken: string, refreshToken: string }> {
        if (!email || !password) {
            throw new BadRequestError('Заполните все поля')
        }

        const emailNorm = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailNorm)) {
            throw new BadRequestError("Введите корректный адрес почты");
        }

        if (password.length < 6) {
            throw new BadRequestError("Пароль должен состоять не менее из 6 символов");
        }

        const user = await userRepo.findByEmail({email: emailNorm})
        if (!user) {
            throw new BadRequestError('Неверные данные авторизации')
        }

        const passwordCorrect = await passwordHasher.compare({password, passwordHash: user.passwordHash})
        if (!passwordCorrect) {
            throw new BadRequestError('Неверные данные авторизации')
        }

        const access_token = tokenManager.signAccessToken({userId: user.id, email: user.email, role: user.role})
        const refresh_token = tokenManager.signRefreshToken({userId: user.id})

        return {accessToken: access_token, refreshToken: refresh_token};
    }
}
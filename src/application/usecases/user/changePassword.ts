import {UserRepository} from "../../ports/repositories/userRepository";
import {PasswordHasher} from "../../ports/security/passwordHasher";
import {BadRequestError, NotFoundError} from "../../../shared/customError";

export function buildChangePassword(userRepo: UserRepository, passwordHasher: PasswordHasher) {
    return async function changePassword({oldPassword, newPassword, userId}: { oldPassword: string, newPassword: string, userId: number, }): Promise<{ success: boolean }> {

        if (!oldPassword || !newPassword || !userId) {
            throw new BadRequestError('Неверный запрос')
        }

        if (newPassword.length < 6) {
            throw new BadRequestError("Пароль должен состоять не менее из 6 символов");
        }

        const user = await userRepo.findPrivateById({id: userId})
        if (!user) {
            throw new NotFoundError('Пользователь не найден')
        }

        const passwordCorrect = await passwordHasher.compare({password: oldPassword, passwordHash: user.passwordHash})
        if (!passwordCorrect) {
            throw new BadRequestError('Неверный пароль')
        }

        if (oldPassword === newPassword) {
            throw new BadRequestError('Пароль должен отличаться')
        }

        const newPasswordHash = await passwordHasher.hash({password: newPassword})

        await userRepo.updatePasswordHash({id: userId, passwordHash: newPasswordHash})
        return {success: true};
    }
}
import {UserRepository} from "../../ports/repositories/userRepository";
import {Role} from "../../../domain/entities/User";
import {ForbiddenError, NotFoundError} from "../../../shared/customError";
import {PasswordHasher} from "../../ports/security/passwordHasher";

const DEFAULT_PASSWORD = '123456'

export function buildResetPassword(userRepo: UserRepository , passwordHasher: PasswordHasher) {
    return async function resetPassword({userId, role, targetUserId}: { userId: number, role: Role, targetUserId: number }): Promise<{ success: boolean }> {

        if (role !== "ADMIN" && userId !== targetUserId) {
            throw new ForbiddenError("Нет прав");
        }

        if (userId !== targetUserId) {
            const user = await userRepo.findById({id: targetUserId})
            if (!user) {
                throw new NotFoundError('Пользователь не найден')
            }
        }

        const passwordHash = await passwordHasher.hash({password: DEFAULT_PASSWORD})

        await userRepo.updatePasswordHash({id: targetUserId, passwordHash})
        return {success: true};
    }
}
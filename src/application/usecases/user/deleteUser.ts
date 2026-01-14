import {Role} from "../../../domain/entities/User";
import {UserRepository} from "../../ports/repositories/userRepository";
import {ForbiddenError} from "../../../shared/customError";

export function buildDeleteUser(userRepo: UserRepository) {
    return async function deleteUser({userId, role, targetUserId}: { userId: number, role: Role, targetUserId: number }): Promise<{ success: boolean }> {
        if (role !== "ADMIN" && userId !== targetUserId) {
            throw new ForbiddenError("Нет прав");
        }

        await userRepo.deleteById({id: targetUserId})
        return {success: true};
    }
}
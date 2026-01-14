import {BadRequestError, ConflictError, ForbiddenError} from "../../../shared/customError";
import {UserRepository} from "../../ports/repositories/userRepository";
import type {PublicUser, Role} from "../../../domain/entities/User";

type UpdateProfileInput = {
    userId: number;
    role: Role;
    targetUserId: number;
    data: Partial<{
        firstName: string;
        lastName: string | null;
        surName: string | null;
        email: string;
        skills: string[];
        role: Role;
    }>;
};

export function buildUpdateProfile(userRepo: UserRepository) {
    return async function updateProfile({userId, role, targetUserId, data}: UpdateProfileInput): Promise<PublicUser> {
        if (role !== "ADMIN" && userId !== targetUserId) {
            throw new ForbiddenError("Нет прав");
        }

        if (!data || Object.keys(data).length === 0) {
            throw new BadRequestError("Нечего обновлять");
        }

        const patch: UpdateProfileInput["data"] = {...data};
        if (patch.firstName !== undefined) {
            const firstNameNorm = patch.firstName.trim();
            if (!firstNameNorm) throw new BadRequestError("Заполните поле Имя");
            patch.firstName = firstNameNorm;
        }

        if (patch.lastName !== undefined) {
            patch.lastName = patch.lastName?.trim() || null;
        }

        if (patch.surName !== undefined) {
            patch.surName = patch.surName?.trim() || null;
        }

        if (patch.email !== undefined) {
            const emailNorm = patch.email.trim().toLowerCase();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailNorm)) {
                throw new BadRequestError("Введите корректный адрес почты");
            }

            if (!emailNorm) throw new BadRequestError("Укажите почту");

            const emailExists = await userRepo.findByEmail({email: emailNorm});
            if (emailExists && emailExists.id !== targetUserId) {
                throw new ConflictError(`Пользователь с почтой ${emailNorm} уже зарегистрирован`)
            }
            patch.email = emailNorm;
        }

        return await userRepo.updateById({
            id: targetUserId,
            data: patch,
        });
    }
}

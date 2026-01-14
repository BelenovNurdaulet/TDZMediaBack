
import {BadRequestError, ConflictError} from "../../../shared/customError";
import {UserRepository} from "../../ports/repositories/userRepository";
import {PasswordHasher} from "../../ports/security/passwordHasher";
import {PublicUser, Role} from "../../../domain/entities/User";

type RegisterInput = {
    firstName: string;
    lastName?: string | null;
    surName?: string | null;
    email: string;
    password: string;
    skills?: string[];
    role?: Role;
};

export function builderRegister(userRepo: UserRepository, passwordHasher: PasswordHasher) {

    return async function register(
        {firstName, lastName, surName, email, password, skills, role = 'USER'}: RegisterInput): Promise<PublicUser> {

        const firstNameNorm = firstName.trim();
        const emailNorm = email.trim().toLowerCase();
        const lastNameNorm = lastName?.trim() || null;
        const surNameNorm = surName?.trim() || null;

        if (!firstNameNorm) throw new BadRequestError("Укажите имя");
        if (!emailNorm) throw new BadRequestError("Укажите почту");
        if (!password) throw new BadRequestError("Укажите пароль");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailNorm)) {
            throw new BadRequestError("Введите корректный адрес почты");
        }

        if (password.length < 6) {
            throw new BadRequestError("Пароль должен состоять не менее из 6 символов");
        }

        const emailExists = await userRepo.findByEmail({email: emailNorm});
        if (emailExists) {
            throw new ConflictError(`Пользователь с почтой ${email} уже зарегистрирован`)
        }

        const passwordHash = await passwordHasher.hash({password});

        return await userRepo.create({
            firstName: firstNameNorm,
            lastName: lastNameNorm ?? null,
            surName: surNameNorm ?? null,
            email: emailNorm,
            skills: skills ?? [],
            role: role ?? 'USER',
            passwordHash
        });
    }
}
import type {Role} from "../../../domain/entities/User";

export type UserCreateDto = {
    firstName: string;
    lastName: string | null;
    surName: string | null;
    email: string;
    passwordHash: string;
    skills?: string[];
    role?: Role;
};

export type UserUpdateDto = {
    id: number;
    data: Partial<{
        firstName: string;
        lastName: string | null;
        surName: string | null;
        email: string;
        skills: string[];
        role: Role;
    }>;
};
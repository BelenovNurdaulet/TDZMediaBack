//userRepository.ts

import {PublicUser, User} from "../../../domain/entities/User";

export interface UserRepository {
    findMany(params?: {
        query?: string;
        page?: number;
        pageSize?: number;
        sortBy?: 'firstName' | 'lastName';
        sortDir?: 'asc' | 'desc';
    }): Promise<{ items: PublicUser[]; total: number }>;

    findById(id: number): Promise<PublicUser | null>;

    findByEmail(email: string): Promise<User | null>;

    create(data: {
        firstName: string;
        lastName: string | null;
        surName: string | null;
        email: string;
        passwordHash: string;
        skills?: string[];
        role?: "USER" | "ADMIN";
    }): Promise<PublicUser>

    updateById(
        id: number,
        data: Partial<{
            firstName: string;
            lastName: string | null;
            surName: string | null;
            email: string;
            passwordHash: string;
            skills: string[];
            role: "USER" | "ADMIN";
        }>
    ): Promise<PublicUser>;

    deleteById(id: number): Promise<void>;
}
export type Role = "USER" | "ADMIN";

export type User = {
    id: number;
    firstName: string;
    lastName: string | null;
    surName: string | null;
    email: string;
    passwordHash: string;
    skills: string[];
    role: Role;
    createdAt: Date;
    updatedAt: Date;
};

export type PublicUser = Omit<User, "passwordHash">;
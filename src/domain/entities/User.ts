export type Role = "USER" | "ADMIN";

export type User = {
    id: number;
    firstName: string;
    lastName: string | null;
    surName: string | null;
    email: string;
    passwordHash: string;
    skills?: string[];
    role: Role;
    createdAt: Date;
    updatedAt: Date;
};

export type PublicUser = Omit<User, "passwordHash">;

export const ROLE_CATALOG: Array<{ id: number; code: Role; name: string }> = [
    { id: 1, code: "USER",  name: "Пользователь" },
    { id: 2, code: "ADMIN", name: "Администратор" },
];
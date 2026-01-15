import type {Request, Response} from "express";
import type {PublicUser, Role} from "../../../domain/entities/User";
import type {ListUsersDto, UserSortField, SortDir} from "../../../application/dto/user/userList";
import {BadRequestError, UnauthorizedError} from "../../../shared/customError";

type ListUsersUc = (params?: ListUsersDto) => Promise<{ items: PublicUser[]; total: number }>;

type GetUserByIdUc = (params: { userId: number }) => Promise<PublicUser>;

type UpdateProfileUc = (params: {
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
    }>; }) => Promise<PublicUser>;

type DeleteUserUc = (params: { userId: number; role: Role; targetUserId: number }) => Promise<{ success: boolean }>;
type ResetPasswordUc = (params: { userId: number; role: Role; targetUserId: number }) => Promise<{ success: boolean }>;
type ChangePasswordUc = (params: { oldPassword: string; newPassword: string; userId: number; }) => Promise<{ success: boolean }>;

function parseId(value: unknown, name = "id"): number {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 1) throw new BadRequestError(`Некорректный ${name}`);
    return n;
}

function parseIds(value: unknown): number[] | undefined {
    if (value === undefined || value === null) return undefined;

    const raw = String(value).trim();
    if (!raw) return undefined;

    const parts = raw.split(/[,\s]+/g).filter(Boolean);
    const ids = parts.map(Number).filter((x) => Number.isInteger(x) && x > 0);

    return ids.length ? ids : undefined;
}

function parseDate(value: unknown): Date | undefined {
    if (value === undefined || value === null) return undefined;

    const raw = String(value).trim();
    if (!raw) return undefined;

    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? undefined : d;
}

function getAuth(req: Request): { id: number; role: Role } {
    const u = req.user;
    const id = u?.id;
    const role = u?.role as Role | undefined;

    if (!id || !role) throw new UnauthorizedError("Вы не авторизованы");
    return {id, role};
}

function pickUpdateData(body: unknown): UpdateProfileUc extends (p: infer P) => any ? P extends {
    data: infer D
} ? D : never : never {
    const b = (body ?? {}) as Record<string, unknown>;

    const data: Record<string, unknown> = {};

    if (typeof b.firstName === "string") data.firstName = b.firstName;
    if (b.lastName === null || typeof b.lastName === "string") data.lastName = b.lastName as any;
    if (b.surName === null || typeof b.surName === "string") data.surName = b.surName as any;
    if (typeof b.email === "string") data.email = b.email;
    if (Array.isArray(b.skills)) data.skills = b.skills as any;
    if (typeof b.role === "string") data.role = b.role as any;

    return data as any;
}

export function buildUserController(deps: {
    listUsers: ListUsersUc;
    getUserById: GetUserByIdUc;
    updateProfile: UpdateProfileUc;
    deleteUser: DeleteUserUc;
    resetPassword: ResetPasswordUc;
    changePassword: ChangePasswordUc;
}) {
    const {listUsers, getUserById, updateProfile, deleteUser, resetPassword, changePassword} = deps;

    return {
        listUsers: async (req: Request, res: Response) => {
            const page = req.query.page !== undefined ? Number(req.query.page) : undefined;
            const pageSize = req.query.pageSize !== undefined ? Number(req.query.pageSize) : undefined;

            const sortBy = (req.query.sortBy !== undefined ? String(req.query.sortBy) : undefined) as UserSortField | undefined;
            const sortDir = (req.query.sortDir !== undefined ? String(req.query.sortDir) : undefined) as SortDir | undefined;

            const where: ListUsersDto["where"] = {
                query: req.query.q !== undefined ? String(req.query.q) : undefined,
                role: (req.query.role !== undefined ? String(req.query.role) : undefined) as Role | undefined,
                ids: parseIds(req.query.ids),
                createdFrom: parseDate(req.query.createdFrom),
                createdTo: parseDate(req.query.createdTo),
                updatedFrom: parseDate(req.query.updatedFrom),
                updatedTo: parseDate(req.query.updatedTo),
            };

            const data = await listUsers({where, page, pageSize, sortBy, sortDir});
            return res.status(200).json(data);
        },

        getMe: async (req: Request, res: Response) => {
            const auth = getAuth(req);
            const user = await getUserById({userId: auth.id});
            return res.status(200).json(user);
        },

        getUserById: async (req: Request, res: Response) => {
            const userId = parseId(req.params.id, "userId");
            const user = await getUserById({userId});
            return res.status(200).json(user);
        },

        updateUser: async (req: Request, res: Response) => {
            const auth = getAuth(req);
            const targetUserId = parseId(req.params.id, "targetUserId");

            const data = pickUpdateData(req.body);

            const user = await updateProfile({
                userId: auth.id,
                role: auth.role,
                targetUserId,
                data,
            });

            return res.status(200).json(user);
        },

        deleteUser: async (req: Request, res: Response) => {
            const auth = getAuth(req);
            const targetUserId = parseId(req.params.id, "targetUserId");

            const result = await deleteUser({
                userId: auth.id,
                role: auth.role,
                targetUserId,
            });

            if (auth.id === targetUserId) {
                res.clearCookie("access_token");
                res.clearCookie("refresh_token");
            }

            return res.status(200).json(result);
        },

        resetPassword: async (req: Request, res: Response) => {
            const auth = getAuth(req);
            const targetUserId = parseId(req.params.id, "targetUserId");

            const result = await resetPassword({
                userId: auth.id,
                role: auth.role,
                targetUserId,
            });

            return res.status(200).json(result);
        },

        changePassword: async (req: Request, res: Response) => {
            const auth = getAuth(req);

            const body = (req.body ?? {}) as { oldPassword?: string; newPassword?: string };
            const oldPassword = typeof body.oldPassword === "string" ? body.oldPassword : "";
            const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

            const result = await changePassword({
                oldPassword,
                newPassword,
                userId: auth.id,
            });

            return res.status(200).json(result);
        },
    };
}

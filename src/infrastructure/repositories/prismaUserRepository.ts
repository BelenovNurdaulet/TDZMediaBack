import type {PrismaClient, Prisma} from '@prisma/client';
import type {UserRepository} from '../../application/ports/repositories/userRepository';
import type {PublicUser, User} from '../../domain/entities/User';
import type {ListUsersDto} from "../../application/dto/user/userList";
import type {UserCreateDto, UserUpdateDto} from "../../application/dto/user/userCreate";
import {mapUserWhereDto} from "../mappers/userWhere";

const publicSelect = {
    id: true,
    firstName: true,
    lastName: true,
    surName: true,
    email: true,
    skills: true,
    role: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.UserSelect;

const privateSelect = {
    id: true,
    firstName: true,
    lastName: true,
    surName: true,
    passwordHash: true,
    email: true,
    skills: true,
    role: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.UserSelect;

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaClient) {
    }

    async findMany(params?: ListUsersDto): Promise<{ items: PublicUser[]; total: number }> {
        const {where, page = 1, pageSize = 10, sortBy = "createdAt", sortDir = "desc"} = params ?? {}
        const orderBy: Prisma.UserOrderByWithRelationInput = {[sortBy]: sortDir};
        const p = Math.max(page, 1);
        const ps = Math.min(Math.max(pageSize, 1), 100);

        const prismaWhere = mapUserWhereDto(where);
        const [items, total] = await Promise.all([
            this.prisma.user.findMany({
                where: prismaWhere,
                skip: (p - 1) * ps,
                take: ps,
                orderBy,
                select: publicSelect,
            }),
            this.prisma.user.count({where: prismaWhere}),
        ]);

        return {items, total};
    }

    async updateById(params: UserUpdateDto): Promise<PublicUser> {
        return this.prisma.user.update({
            where: {id: params.id},
            data: params.data,
            select: publicSelect,
        });
    }

    async create(params: UserCreateDto): Promise<PublicUser> {
        return this.prisma.user.create({
            data: {
                firstName: params.firstName,
                lastName: params.lastName,
                surName: params.surName,
                email: params.email,
                passwordHash: params.passwordHash,
                skills: params.skills ?? [],
                role: params.role ?? 'USER',
            },
            select: publicSelect,
        });
    }

    async findById(params: { id: number }): Promise<PublicUser | null> {
        return this.prisma.user.findUnique({
            where: {id: params.id},
            select: publicSelect,
        });
    }

    async findByEmail(params: { email: string }): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {email: params.email},
        });
    }

    async deleteById(params: { id: number }): Promise<void> {
        await this.prisma.user.delete({
            where: {id: params.id},
        })
    }

    async findPrivateById(params: { id: number }): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {id: params.id},
            select: privateSelect,
        })
    }

    async updatePasswordHash(params: { id: number, passwordHash: string }): Promise<void> {
        await this.prisma.user.update({
            where: {id: params.id},
            data: {passwordHash: params.passwordHash},
        })
    }
}

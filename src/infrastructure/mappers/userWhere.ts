import type { Prisma } from "@prisma/client";
import type { UserWhereDto } from "../../application/dto/user/userList";

export function mapUserWhereDto(where?: UserWhereDto): Prisma.UserWhereInput | undefined {
    if (!where) return undefined;

    const w: Prisma.UserWhereInput = {};

    if (where.role) {
        w.role = where.role;
    }

    if (where.ids?.length) {
        w.id = { in: where.ids };
    }

    if (where.createdFrom || where.createdTo) {
        w.createdAt = {
            ...(where.createdFrom ? { gte: where.createdFrom } : {}),
            ...(where.createdTo ? { lte: where.createdTo } : {}),
        };
    }

    if (where.updatedFrom || where.updatedTo) {
        w.updatedAt = {
            ...(where.updatedFrom ? { gte: where.updatedFrom } : {}),
            ...(where.updatedTo ? { lte: where.updatedTo } : {}),
        };
    }

    const q = where.query?.trim();
    if (q) {
        w.OR = [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { surName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
        ];
    }

    return w;
}

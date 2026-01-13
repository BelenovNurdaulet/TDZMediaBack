import type {Role} from "../../../domain/entities/User";

export type UserSortField =
    | "id"
    | "firstName"
    | "lastName"
    | "surName"
    | "email"
    | "createdAt"
    | "updatedAt";

export type SortDir = "asc" | "desc";

export type UserWhereDto = {
    query?: string;
    role?: Role;
    createdFrom?: Date;
    createdTo?: Date;
    updatedFrom?: Date;
    updatedTo?: Date;
    ids?: number[];
};

export type ListUsersDto = {
    where?: UserWhereDto;
    page?: number;
    pageSize?: number;
    sortBy?: UserSortField;
    sortDir?: SortDir;
};

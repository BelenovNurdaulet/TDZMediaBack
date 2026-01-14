import type {PublicUser} from "../../../domain/entities/User";
import type {UserRepository} from "../../ports/repositories/userRepository";
import {BadRequestError} from "../../../shared/customError";
import type {ListUsersDto} from "../../dto/user/userList";

export function buildListUsers(userRepo: UserRepository) {

    return async function listUsers(params?: ListUsersDto): Promise<{ items: PublicUser[]; total: number }> {
        const {where, page = 1, pageSize = 10, sortBy = "createdAt", sortDir = "desc"} = params ?? {};

        if (!Number.isInteger(page) || page < 1) {
            throw new BadRequestError("Некорректный номер страницы");
        }
        if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
            throw new BadRequestError("Лимит записей на страницу: от 1 до 100");
        }
        if (sortDir !== "asc" && sortDir !== "desc") {
            throw new BadRequestError("Допустимые значения сортировки: asc, desc");
        }

        const allowedSort = ["id", "firstName", "lastName", "surName", "email", "createdAt", "updatedAt"];
        if (!allowedSort.includes(sortBy)) {
            throw new BadRequestError("Сортировка по данному полю недоступна");
        }

        const query = where?.query?.trim() || undefined;

        const ids = where?.ids
            ? where.ids.filter((x) => Number.isInteger(x) && x > 0)
            : undefined;

        const createdFrom = where?.createdFrom ? new Date(where.createdFrom) : undefined;
        const createdTo = where?.createdTo ? new Date(where.createdTo) : undefined;
        const updatedFrom = where?.updatedFrom ? new Date(where.updatedFrom) : undefined;
        const updatedTo = where?.updatedTo ? new Date(where.updatedTo) : undefined;

        if (createdFrom && Number.isNaN(createdFrom.getTime())) {
            throw new BadRequestError("Некорректная дата");
        }
        if (createdTo && Number.isNaN(createdTo.getTime())) {
            throw new BadRequestError("Некорректная дата");
        }
        if (updatedFrom && Number.isNaN(updatedFrom.getTime())) {
            throw new BadRequestError("Некорректная дата");
        }
        if (updatedTo && Number.isNaN(updatedTo.getTime())) {
            throw new BadRequestError("Некорректная дата");
        }

        if ((createdFrom && createdTo && createdFrom > createdTo) || (updatedFrom && updatedTo && updatedFrom > updatedTo)) {
            throw new BadRequestError("Начальная дата не может быть позже конечной");
        }


        return await userRepo.findMany({
            where: {
                ...where,
                query,
                ids: ids && ids.length ? ids : undefined,
                createdFrom,
                createdTo,
                updatedFrom,
                updatedTo,
            },
            page,
            pageSize,
            sortBy,
            sortDir,
        });
    }
}

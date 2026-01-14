//userRepository.ts
import {PublicUser, User} from "../../../domain/entities/User";
import {ListUsersDto} from "../../dto/user/userList";
import {UserCreateDto, UserUpdateDto} from "../../dto/user/userCreate";

export interface UserRepository {
    findMany(params?: ListUsersDto): Promise<{ items: PublicUser[]; total: number }>;

    findById(params: { id: number }): Promise<PublicUser | null>;

    findByEmail(params: { email: string }): Promise<User | null>;

    create(params: UserCreateDto): Promise<PublicUser>;

    updateById(params: UserUpdateDto): Promise<PublicUser>;

    deleteById(params: { id: number }): Promise<void>;

    findPrivateById(params:{ id: number }): Promise<User | null>;

    updatePasswordHash(params: { id: number, passwordHash:string }): Promise<void>
}
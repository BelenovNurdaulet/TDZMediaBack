import {PublicUser} from "../../../domain/entities/User";
import {UserRepository} from "../../ports/repositories/userRepository";
import {NotFoundError} from "../../../shared/customError";

export function buildGetUserById(userRepo:UserRepository) {

    return async function getUserById({userId}: {userId: number}): Promise<PublicUser> {
        const user = await userRepo.findById({id: userId});
        if (!user) {
            throw new NotFoundError("Пользователь не найден");
        }

        return user;
    }
}
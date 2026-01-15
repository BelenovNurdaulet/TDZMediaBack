import {Router} from "express";


import {PrismaUserRepository} from "./infrastructure/repositories/prismaUserRepository";


import {builderRegister} from "./application/usecases/auth/register";
import {builderLogin} from "./application/usecases/auth/login";
import {buildRefreshToken} from "./application/usecases/auth/refreshToken";
import {buildGetInfo} from "./application/usecases/info/getInfo";

import {buildListUsers} from "./application/usecases/user/listUsers";
import {buildGetUserById} from "./application/usecases/user/getUserById";
import {buildUpdateProfile} from "./application/usecases/user/updateUser";
import {buildDeleteUser} from "./application/usecases/user/deleteUser";


import {buildAuthController} from "./presentation/http/controllers/authController";
import {buildUserController} from "./presentation/http/controllers/userController";
import {buildInfoController} from "./presentation/http/controllers/infoController";


import {buildAuthRoutes} from "./presentation/http/routes/authRoutes";
import {buildUserRoutes} from "./presentation/http/routes/userRoutes";
import {buildInfoRoutes} from "./presentation/http/routes/infoRoutes";

import {buildAuthenticate} from "./presentation/http/middlewares/authenticate";
import {BcryptPasswordHasher} from "./infrastructure/services/bcryptPasswordHasher";
import {JWTTokenManager} from "./infrastructure/services/jwtTokenManager";
import {prisma} from "./infrastructure/db/prisma";
import {buildChangePassword} from "./application/usecases/user/changePassword";
import {buildResetPassword} from "./application/usecases/user/resetPassword";

export function buildApiRouter() {
    const router = Router();


    const userRepo = new PrismaUserRepository(prisma);

    const passwordHasher = new BcryptPasswordHasher();

    const tokenManager = new JWTTokenManager({
        secret: process.env.JWT_SECRET ?? "dev_secret",
        accessExpiresIn: Number(process.env.JWT_EXPIRES_ACCESS_IN) || 900,
        refreshExpiresIn: Number(process.env.JWT_EXPIRES_REFRESH_IN) || 604800,
    });


    const authenticate = buildAuthenticate(tokenManager);

    const register = builderRegister(userRepo, passwordHasher);
    const login = builderLogin(userRepo, passwordHasher, tokenManager);
    const refreshToken = buildRefreshToken(userRepo, tokenManager);

    const getInfoUc = buildGetInfo();

    const changePassword = buildChangePassword(userRepo, passwordHasher);
    const resetPassword = buildResetPassword(userRepo, passwordHasher);
    const listUsers = buildListUsers(userRepo);
    const getUserById = buildGetUserById(userRepo);
    const updateProfile = buildUpdateProfile(userRepo);
    const deleteUser = buildDeleteUser(userRepo);


    const authController = buildAuthController({register, login, refreshToken});

    const infoController = buildInfoController({getInfoUc});
    const userController = buildUserController({
        listUsers,
        getUserById,
        updateProfile,
        deleteUser,
        resetPassword,
        changePassword,
    });

    router.use("/api/auth", buildAuthRoutes(authController));
    router.use("/api", buildInfoRoutes(infoController));
    router.use("/api/users", buildUserRoutes(userController, authenticate));

    return router;
}

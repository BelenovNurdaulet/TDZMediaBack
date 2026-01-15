import {RequestHandler, Router} from "express";
import {asyncHandler} from "../../../shared/asyncHandler";

type AuthController = {
    register: RequestHandler;
    login: RequestHandler;
    refreshToken: RequestHandler;
    logout: RequestHandler;
};

export function buildAuthRoutes( authController : AuthController) {
    const router = Router();

    router.post('/register', asyncHandler(authController.register));
    router.post('/login', asyncHandler(authController.login));
    router.post('/refresh', asyncHandler(authController.refreshToken));
    router.post('/logout', asyncHandler(authController.logout));


    return router;
}
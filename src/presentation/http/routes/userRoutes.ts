import {RequestHandler, Router} from "express";
import {asyncHandler} from "../../../shared/asyncHandler";

type UserController = {
    listUsers: RequestHandler;
    getMe: RequestHandler;
    getUserById: RequestHandler;
    updateUser: RequestHandler;
    deleteUser: RequestHandler;
    resetPassword: RequestHandler;
    changePassword: RequestHandler;
};


export function buildUserRoutes(userController: UserController, authenticate: RequestHandler) {
    const router = Router();

    router.get('/', asyncHandler(userController.listUsers));
    router.get('/me', authenticate, asyncHandler(userController.getMe));
    router.get('/:id', authenticate, asyncHandler(userController.getUserById));

    router.patch('/:id', authenticate, asyncHandler(userController.updateUser));
    router.delete('/:id', authenticate, asyncHandler(userController.deleteUser));

    router.patch('/:id/password/reset', authenticate, asyncHandler(userController.resetPassword));
    router.patch('/me/password/change', authenticate, asyncHandler(userController.changePassword));

    return router;
}
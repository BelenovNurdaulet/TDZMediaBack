import {type RequestHandler, Router} from "express";
import {asyncHandler} from "../../../shared/asyncHandler";

type InfoController = {
    getInfo: RequestHandler;
};

export function buildInfoRoutes(infoController: InfoController) {
    const router = Router();

    router.get("/info", asyncHandler(infoController.getInfo));

    return router;
}

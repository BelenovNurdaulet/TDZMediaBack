import type {Request, Response} from "express";
import type {Role, PublicUser} from "../../../domain/entities/User";

type RegisterBody = {
    firstName: string;
    lastName?: string | null;
    surName?: string | null;
    email: string;
    password: string;
    skills?: string[];
    role?: Role;
};
type LoginBody = {
    email: string;
    password: string
};

type RegisterUc = (params: RegisterBody) => Promise<PublicUser>;
type LoginUc = (params: LoginBody) => Promise<{ accessToken: string; refreshToken: string }>;
type RefreshUc = (params: { refreshToken: string }) => Promise<{ accessToken: string; refreshToken: string }>;

export function buildAuthController(deps: { register: RegisterUc; login: LoginUc; refreshToken: RefreshUc; }) {
    const {register, login, refreshToken} = deps;

    return {
        register: async (req: Request, res: Response) => {
            const body = req.body as RegisterBody;
            const user = await register(body);
            return res.status(201).json(user);
        },

        login: async (req: Request, res: Response) => {
            const body = req.body as LoginBody;
            const tokens = await login(body);
            res.cookie("access_token", tokens.accessToken, { httpOnly: true, sameSite: "lax" });
            res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true, sameSite: "lax" });
            return res.status(200).json(tokens);
        },

        refreshToken: async (req: Request, res: Response) => {
            const tokenFromCookie = req.cookies?.refresh_token as string | undefined;
            const tokenFromBody = (req.body as { refreshToken?: string } | undefined)?.refreshToken;
            const token = tokenFromCookie ?? tokenFromBody ?? "";
            const tokens = await refreshToken({refreshToken: token});
            res.cookie("access_token", tokens.accessToken, { httpOnly: true });
            res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
            return res.status(200).json(tokens);
        },

        logout: async (_req: Request, res: Response) => {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            return res.status(200).json({success: true});
        },
    };
}

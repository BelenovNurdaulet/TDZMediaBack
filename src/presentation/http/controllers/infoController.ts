import {Request, Response} from "express";

export function buildInfoController({ getInfoUc }: { getInfoUc: () => Promise<{ roles: any[] }> }) {
    return {
        getInfo: async (_req: Request, res: Response) => {
            const data = await getInfoUc();
            return res.status(200).json(data);
        },
    };
}

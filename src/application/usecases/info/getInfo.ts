import {Role, ROLE_CATALOG} from "../../../domain/entities/User";

export function buildGetInfo() {
    return async function getInfo(): Promise<{ roles: { id: number; code: Role; name: string }[]; }> {
        return { roles: ROLE_CATALOG };
    };
}
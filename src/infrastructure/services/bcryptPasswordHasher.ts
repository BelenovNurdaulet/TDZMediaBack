import {PasswordHasher} from "../../application/ports/security/passwordHasher";
import bcrypt from "bcrypt";

export class BcryptPasswordHasher implements PasswordHasher {
    async hash(params: { password: string, salt?: number }): Promise<string> {
        return await bcrypt.hash(params.password, params.salt ?? 10);
    }

    async compare(params: { password: string, passwordHash: string }): Promise<boolean> {
        return await bcrypt.compare(params.password, params.passwordHash);
    }
}
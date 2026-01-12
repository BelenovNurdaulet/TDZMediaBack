//passwordHasher.ts
export interface PasswordHasher {
    hash(params: {
        password: string;
        salt? : number;
    }): Promise<string>;

    compare(params: {
        password: string;
        passwordHash: string;
    }) : Promise<boolean>;
}
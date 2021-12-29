import { UserTipo } from "./enum/tipo-user.enum"

export class User {
    readonly id!: number;
    fullName!: string;
    ciudad!: string;
    email!: string;
    username!: string;
    password!: string;
    userTipo!: UserTipo;
    lastLoginDate!: Date;
    joinDate!: Date;
    updatedAt!: Date;
    active!: boolean;
    nonLocked!: boolean;
    roles: Role[]=[];
}

export class Role {
    readonly id!: number;
    role!: string;
}
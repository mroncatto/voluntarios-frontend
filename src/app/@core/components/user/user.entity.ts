import { UserTipo } from "../../enum/tipo-user.enum"

export class User {
    readonly id!: number;
    fullName!: string;
    ciudad!: string;
    email!: string;
    username!: string;
    password!: string;
    userTipo: UserTipo;
    joinDate!: Date;
    updatedAt!: Date;
    active!: boolean;
    nonLocked!: boolean;
    roles: Role[];

    constructor(){
        this.userTipo = UserTipo.VOLUNTARIO;
        this.roles = [];
    }
}

export class Role {
    readonly id!: number;
    role!: string;
}
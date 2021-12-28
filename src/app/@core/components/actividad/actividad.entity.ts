import { Situacion } from "../../enum/situacion.enum";
import { User } from "../user/user.entity";

export class Actividad {
    id!: number;
    actividad!: string;
    detalle!: string;
    situacion!: Situacion;
    creadoPor!: User;
    inicio!: Date;
    creado!: Date;
    alterado!: Date;
    voluntarios: User[] = [];
}
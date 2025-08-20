import {Permission} from "./permission";

export interface Role {
    id : number;
    nom: string;
    permissions: Permission[];
}


export interface RoleDto {
    nom: string;
    permissions: number[];
}

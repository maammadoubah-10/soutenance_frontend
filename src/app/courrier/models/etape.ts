import { Poste } from '../../rh/models/poste';
export interface Etape {
    id: number;
    instruction : string;
    processus : number;
    poste : Poste;
    delai: number;
}


export interface EtapeDto {
    instruction : string;
    processus : number;
    poste : number;
    delai: number;
}

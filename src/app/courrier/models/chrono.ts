import { Service } from './../../rh/models/service';
import { Categorie } from './categorie';
export interface Chrono {
    id : number;
    reference: string;
    service : Service;
    categorie: Categorie;
}


export interface ChronoDto {
    reference: string;
    service : number;
    categorie: number;
}

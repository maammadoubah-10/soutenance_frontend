import { Personnel } from './personnel';
import { Category } from './category';
import { Echelon } from './echelon';
export interface Avancement {
    id:number,
    dateChangementCategorie:Date,
    categorie:Category,
    personnel:Personnel,
    echelon:Echelon
}

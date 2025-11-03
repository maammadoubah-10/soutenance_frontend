import { Echelon } from './echelon';
import { Category } from './category';
export interface SalaireBase {
  id:number,
  montant:number,
  echelon:Echelon,
  categorie:Category,
}

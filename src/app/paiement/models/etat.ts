import { Entite } from './entite';
import { TypeEtat } from './type-etat';
export interface Etat {
  id:number,
  dateDebut:Date,
  dateFin:Date,
  entite:Entite,
  typeEtat:TypeEtat
}

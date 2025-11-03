import { Personnel } from './personnel';
import { TypeAutorisation } from './type-autorisation';
export interface Autorisation {
  id:number,
  dateDebut:Date,
  dateFin:Date,
  observation:string,
  personnel:Personnel,
  typeAutorisation:TypeAutorisation
}

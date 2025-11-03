import { SalaireBase } from './salaire-base';
import { TypePrelevement } from './type-prelevement';
export interface Prelevement {
  id:number,
  montant:number,
  salaireBase:SalaireBase,
  typePrelevement:TypePrelevement
}

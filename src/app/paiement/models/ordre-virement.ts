import { Banque } from './banque';
import { Personnel } from './personnel';
export interface OrdreVirement {
  id :  number
  banque : Banque
  numeroBanque : number
  intitule : string
  detailsPersonnels: Personnel[]
}

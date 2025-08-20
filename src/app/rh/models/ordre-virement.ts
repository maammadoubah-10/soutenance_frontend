import { Banques } from './banques';
import { Personnel } from './personnel';
export interface OrdreVirement {
  id :  number
  banque : Banques
  numeroBanque : number
  intitule : string
  detailsPersonnels: Personnel[]
}

import { TypePrime } from './type-prime';
import { Category } from './category';
import { Poste } from './poste';
export interface Prime {
  id: number,
  montant: number,
  categorie: Category,
  typePrime: TypePrime,
  poste:Poste
}

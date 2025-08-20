import { Personnel } from './personnel';
import { TypeRetenu } from './type-retenu';
export interface Retenu {
  id:number,
  montant:number,
  augmentation:number,
  nombreMoisRemboursement:number,
  personnel:Personnel,
  typeRetenu:TypeRetenu
}

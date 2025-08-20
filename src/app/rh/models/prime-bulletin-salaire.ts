import { BulletinSalaire } from './bulletin-salaire';
import { Prime } from './prime';
export interface PrimeBulletinSalaire {
  id:number,
  bulletinSalaire: BulletinSalaire,
  montantPrime: number,
  prime: Prime
}

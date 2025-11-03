import { Personnel } from './personnel';
export interface BulletinSalaire {
  id: number,
  mois:string,
  personnels:Personnel[]
}

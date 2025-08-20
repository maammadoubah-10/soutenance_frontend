import { Personnel } from './personnel';
import {Retenu} from "./retenu";
export interface BulletinSalaire {
  id: number,
  mois:string,
  personnel:Personnel
  personnels:Personnel []
  retenus: Retenu []
  apayer: number
}

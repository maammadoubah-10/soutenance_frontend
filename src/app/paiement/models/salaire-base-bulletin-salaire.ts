import { BulletinSalaire } from './bulletin-salaire';
import { SalaireBase } from './salaire-base';
export interface SalaireBaseBulletinSalaire {
  id: number,
  bulletinSalaire: BulletinSalaire,
  montantSalaireBase: number,
  salaireBase: SalaireBase
}


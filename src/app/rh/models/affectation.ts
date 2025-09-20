import { Personnel } from './personnel';
import { Poste } from './poste';

export interface Affectation {
  id: number;
  dateDebut: string;     // ISO ou "yyyy-MM-dd" selon ce que renvoie le backend
  personnel: Personnel;
  poste: Poste;
}

import {Personnel} from "./personnel";
import {Poste} from "./poste";

export interface Affectation {

  id: number,
  dateDebut: Date,
  dateFin: Date,
  personnel: Personnel
  poste: Poste
}

import {Personnel} from "./personnel";
import {Poste} from "./poste";

export interface Interimes {

  id: number,
  dateDebut: Date,
  dateFin: Date,
  personnel: Personnel
  poste: Poste
  commentaire : string

}

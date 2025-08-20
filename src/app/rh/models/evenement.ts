import {Candidature} from "./candidature";
import {Jury} from "./jury";
import {Avisrecrutement} from "./avisrecrutement";
import {TypeEvenement} from "./type-evenement";
import {Pieces} from "./pieces";
import {CritereEvenement} from "./critere-evenement";

export interface Evenement {
  id: number,
  date: Date,
  dateDebut: Date,
  dateFin: Date,
  note: number,
  commentaire: string,
  piece: Pieces,
  candidature: Candidature
  jury: Jury
  critereEvenement: CritereEvenement
  avisRecrutement: Avisrecrutement
  typeEvenement: TypeEvenement

}

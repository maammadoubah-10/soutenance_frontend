import {StatutCandidature} from "./statut-candidature";
import {Candidat} from "./candidat";
import {Avisrecrutement} from "./avisrecrutement";
import {Poste} from "./poste";

export interface Candidature {
  id: number,
  dateCandidature: Date,
  referent: string,
  appreciation: number
  statutCandidature: StatutCandidature
  candidat: Candidat
  avisRecrutement: Avisrecrutement
  poste: Poste
}

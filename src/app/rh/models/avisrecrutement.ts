import {Poste} from "./poste";

export interface Avisrecrutement {

  id: number,
  titre: string
  description: string
  qualification: string
  dateLimite: Date
  datePublication: Date
  fichier: string
  postes: Poste[]
}

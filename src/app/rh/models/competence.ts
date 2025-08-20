import {Personnel} from "./personnel";

export interface Competence {
  id: number
  fichier: string
  designation: string
  personnel: Personnel
}

import {Personnel} from "./personnel";

export interface Avenant {
  id: number
  date: Date
  fichier: string
  estActif: boolean
  personnel: Personnel
}

import {Personnel} from "./personnel";

export interface Conge {
  id: number,
  date: Date,
  dateDebut: Date,
  dateFin: Date,
  commentaire: string,
  valide: boolean
  personnel?: Personnel
  personnelId: number
  pieces:string
  typeConge:string
  motif:string
  nbreJour:number
}

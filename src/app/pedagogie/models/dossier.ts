import { Piece } from "./piece";
import { PreInscription } from "./pre-inscription";

export interface Dossier {
  id : number ;
  fichier : string ;
  slug : string ;
  statut : boolean ;
  piece : Piece ;
  preinscription : PreInscription ;
}

export enum statusEtat {
  En_cours = "En cours",

  Refuser = "Refuser",

  Valider = "Valider",
}

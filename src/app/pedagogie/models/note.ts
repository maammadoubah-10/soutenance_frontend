import { PreInscription } from "./pre-inscription";

export interface Note {
  id : number ;
  math : number ;
  pct : number ;
  svt : number ;
  niveau : string ;
  fichier : string ;
  preinscription : PreInscription ;
}


import { Courrier } from "./courrier";
import { Etape } from "./etape";

export interface Traitement {
  id : number;
  commentaire : string;
  fichier: string;
  courrier : Courrier
  etape? : Etape
}

export interface TraitementDto {
  commentaire : string;
  courrier : number;
}


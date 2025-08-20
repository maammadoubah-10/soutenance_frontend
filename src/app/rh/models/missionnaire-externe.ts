import {Indice} from "./indice";
import {Banques} from "./banques";

export interface MissionnaireExterne {
  id: number
  nom: string
  prenom:	string
  fonction:	string
  pieceIdentite:	string
  rib:	string
  indice:Indice
  banque: Banques
}

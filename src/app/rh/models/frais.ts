import {Indice} from "./indice";
import {Facteur} from "./facteur";
import {TypeMission} from "./type-mission";

export interface Frais {
  id: number,
  montant: number
  indice:Indice
  facteur: Facteur
  typeMission:TypeMission

}

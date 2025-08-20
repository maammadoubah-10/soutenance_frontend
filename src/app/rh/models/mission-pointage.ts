import {Facteur} from "./facteur";
import {Mission} from "./mission";
import {Personnel} from "./personnel";

export interface MissionPointage {
  id: number
  date: Date
  facteur: Facteur,
  mission: Mission,
  personnel: Personnel
}

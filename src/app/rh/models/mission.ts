import {Personnel} from "./personnel";
import {Imputation} from "./imputation";
import {MissionnaireExterne} from "./missionnaire-externe";
import {TypeMission} from "./type-mission";

export interface Mission {
  id: number,
  reference: string
  objet: string
  motif: string
  message: string
  accompagne: string
  conducteur: Personnel
  personnels: Personnel[]
  dateDebut: Date
  dateFin: Date
  nbreJour: number
  typeDemande: string
  personnel : Personnel
  pieces: string,
  imputation: Imputation
  missionnaireExternes: MissionnaireExterne[]
  moyenTransport: string
  moyenDeplacement : string
  typeMission: TypeMission
  rapport: string
  duree: string
  isTodayBetweenDates: boolean
  chefValidation: number
  csrhValidation: number
  sgValidation: number
  dgValidation: number
  attestation: string,
}

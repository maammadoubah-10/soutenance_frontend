import {Personnel} from "./personnel";
import {StatutDemande} from "./statut-demande";
import {TypeDemande} from "./type-demande";

export interface Demande {
  id: number,
  date: Date,
  dateDebut: Date,
  reference: string,
  dateDebutStr: Date,
  dateFin: Date,
  dateFinStr: Date,
  commentaire: string,
  fichier: string,
  pieces: string,
  attestation: string,
  personnel: Personnel
  statutDemande: StatutDemande
  typeDemande: string
  nbreJour: number
  chefValidation: number
  csrhValidation: number
  chefId: number
  sgValidation: number
  dgValidation: number
  posteGeneral : any
  message : string
  motif: string
  mois: number
}




import {Personnel} from "./personnel";
import {StatutDemande} from "./statut-demande";

export interface DemandeConge {
  id: number
  date: Date,
  dateDebut: Date,
  reference: string,
  dateDebutStr: Date,
  dateFin: Date,
  dateReprise: Date,
  dateFinStr: Date,
  commentaire: string,
  fichier: string,
  pieces: string,
  attestation: string,
  personnel: Personnel
  statutDemande: StatutDemande
  typeDemande: string
  typeConge : typeConge
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

export enum typeConge {
  CongeLegal = "Conge Legal",
  CongeAnnuel = "Conge Annuel",
  CongeFractionne = "Conge Fractionnee",
}


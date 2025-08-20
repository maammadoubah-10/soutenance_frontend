import {Personnel} from "./personnel";
import {StatutDemande} from "./statut-demande";

export interface DemandeActeAdministratif {
  id: number
  typeDemandeSelect : typeDemandeSelect
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

}

export enum typeDemandeSelect {

  AT = "ATTESTATION DE TRAVAIL",
  CT = "CERTIFICAT DE TRAVAIL",
}

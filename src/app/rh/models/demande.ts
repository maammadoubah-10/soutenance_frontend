// src/app/rh/demande/models/demande.ts
import {Personnel} from "./personnel";
import {StatutDemande} from "./statut-demande";

export interface Demande {
  id: number;
  date?: string | Date;
  dateDebut?: string | Date;
  reference?: string;
  dateDebutStr?: string;     // ← string (pas Date)
  dateFin?: string | Date;
  dateFinStr?: string;       // ← string (pas Date)
  commentaire?: string;
  fichier?: string;
  pieces?: string;
  attestation?: string;
  personnel?: Personnel;
  statutDemande?: StatutDemande;
  typeDemande?: string | { code?: string; libelle?: string };
  nbreJour?: number | string;
  chefValidation?: number;
  csrhValidation?: number;
  chefId?: number;
  sgValidation?: number;
  dgValidation?: number;
  posteGeneral?: any;
  message?: string;
  motif?: string;
  mois?: number;
}

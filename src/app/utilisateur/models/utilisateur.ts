import { Role } from './role';
import { EtatCivil } from './etat-civil';
import { Personnel } from './personnel';

export interface Utilisateur {
    id: number;
    email: string;
    roles? : Role[];
    personnel : Personnel;
    personnelid : number;
    est_actif: boolean
    estActif: boolean;
    estAdmin: boolean
    

  // champs potentiellement présents côté backend
  personnelId?: number;

  codeImageDeProfil?: string;
  tailleImageDeProfil?: number;

}

/**
 * DTO attendu par le backend:
 * - @JsonProperty("role") Set<Long> role
 * - @JsonProperty("personnel") Long personnel
 * - motdepasse (requis côté service backend actuel -> on l’envoie)
 * - personnelid (utilisé par le backend pour lier côté RH)
 */
// src/app/utilisateur/models/utilisateur.ts
export interface UtilisateurDto {
  email?: string;
  motdepasse?: string;     // <= maintenant optionnel
  role: number[];
  personnel?: number;
  personnelid: number;
}


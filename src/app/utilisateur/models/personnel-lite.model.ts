// src/app/utilisateur/models/personnel-lite.model.ts
export interface EtatCivilLite {
  nom?: string;
  prenom?: string;
  email?: string;
}

export interface PersonnelLite {
  id: number;
  etatCivil?: EtatCivilLite;   // <= optionnel
}

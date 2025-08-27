import { EtatCivilLite } from "./personnel-lite.model";

export interface EtatCivil {
  matricule: string;
  civilite: string;
  nom: string;
  prenom: string;
  situationMatrimoniale: string;
  nombreEnfant: number;
  dateDeNaissance: Date;
  paysOrigine: string;
  numeroCarteSejour: string;
  dateExpirationCarteSejour: Date;
  sourceCarteSejour: string;
  email: string;
}
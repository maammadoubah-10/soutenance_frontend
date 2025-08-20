import {NiveauEtude} from "./niveau-etude";

export interface Candidat {
  id: number,
  nom: string,
  prenom: string,
  adresse: string,
  email: string,
  telephone: number
  civilite: civilite
  experiencePro: string,
  competence: string,
  niveauEtude: NiveauEtude
}

export enum civilite {
  Monsieur = "MONSIEUR",

  Madame = "MADAME",
}

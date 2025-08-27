import { EtatCivil } from "./etat-civil";
import { Poste } from "./poste";

export interface Personnel {
  id : number;
  nom :string;
  prenom : string;
  etatCivil:EtatCivil;
  poste:Poste;
}

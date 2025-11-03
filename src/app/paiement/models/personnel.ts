import { Entite } from './entite';
import { Banque } from './banque';
import { SalaireBase } from './salaire-base';
import { Autorisation } from './autorisation';
import { Poste } from './poste';
export interface Personnel {
  id:number,
  adresse:string,
  civilite:string,
  dateDeNaissance:Date,
  deboucher:boolean,
  nom:string,
  fullName:string,
  nomContact:string,
  nombreEnfant:string,
  numeroCnss:string,
  pieceIdentite:string,
  prenom:string,
  prenomContact:string,
  situationMatrimoniale:string,
  telephone:string,
  telephoneContact:string,
  poste : Poste
  entite:Entite,
  banque:Banque,
  salaireBase:SalaireBase,
  autorisation:Autorisation
}

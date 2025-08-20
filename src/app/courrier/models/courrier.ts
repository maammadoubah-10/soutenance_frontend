import { Correspondant } from './correspondant';
import { Classe } from './classe';
import { Etape } from './etape';
import { Soustype } from './soustype';
import {TypeCourrier} from "./typeCourrier";
export interface Courrier {
  id : number;
  numeroOrdre: number;
  nombreDePiece: number;
  correspondant : Correspondant ;
  reference : string;
  fichier: string;
  objet : string;
  resume : string;
  dateRedaction : Date;
  dateCorrespondance : Date;
  dateArrivee : Date;
  dateDepart : Date;
  observation : number ;
  classe : Classe ;
  sousType:Soustype;
  soustype:Soustype;
  sousTypes:Soustype ;
  types:TypeCourrier;
  categorie : number ;
  courriers : number ;
  courrierParent : Courrier ;
  registre : number ;
  chrono : number ;
  personnelCourrierEnregistrer : number ;
  personnelCourrierEnvoyee : number ;
  personnelCourrierRecu : number ;
  affectations : number;
  nature: boolean
  termineTraitement : boolean
  slug : number
  etape? : Etape

  courrier: any; // Ajoutez le type approprié ici
  dejaSigner: boolean;
}


export interface CourrierDto {
  chrono : number ;
  classe : number ;
  sousType:number;
  codeCategorie : number ;
  correspondant : number ;
  courrierParent : number ;
  dateArrivee : Date;
  dateCorrespondance : Date;
  dateDepart : Date;
  dateRedaction : Date;
  modeEnvoie : string ;
  etape : number;
  ficher : string
  fichierCourrier : string
  nature : boolean
  nombreDePiece: number;
  numeroOrdre: number;
  objet : string;
  observation : string ;
  personnelCourrierEnregistrer : number ;
  personnelCourrierEnvoyee : number ;
  personnelCourrierRecu : number ;
  reference : string;
  resume : string;
}

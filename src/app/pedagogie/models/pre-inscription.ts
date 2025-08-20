import {Piece} from './piece';
import { Requerant } from './requerant';

export interface PreInscription {
  id : number ;
  // email: string;
  // nom: string;
  // prenom: string;
  requerantEmetteur: Requerant;
  requerantRecepteur: Requerant;
  semestre: string;

  piece : Piece ;
  fichier: string;
}

export enum etat {
  En_cours = "EN COURS",

  Terminer = "TERMINER",
}

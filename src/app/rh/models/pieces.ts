import {Dossier} from "./dossier";
import {Personnel} from "./personnel";
import {TypePiece} from "./type-piece";
import {Candidature} from "./candidature";
import {Evenement} from "./evenement";

export interface Pieces {
  id: number,
  fichier : string,
  commentaire: string,
  typeDossier: Dossier
  personnel: Personnel
  typePiece: TypePiece
  candidature: Candidature
  entretien: Evenement
}

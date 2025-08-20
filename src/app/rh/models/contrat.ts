import {TypeDeContrat} from "./type-de-contrat";
import {Personnel} from "./personnel";

export interface Contrat {
  id: number,
  dateDebut: Date
  dateFin: Date
  fichier: string
  pieces: string
  status: boolean
  typeContrat: TypeDeContrat
  personnel: Personnel
  duree: string

  /// NEW
  anneeEncours: number;
  numero: number;
  anneePassee: number;
  anneeSurpassee: number;
  dateAncienneteEntreprise: Date;
  dateAncienneteProfession: Date;
  dateDebutContrat: Date;
  dateDebutEssaie: Date;
  dateEmbauche: Date;
  dateFinContrat: Date;
  dateFinEssaie: Date;
  motifDepart: string;
  natureContrat: string;
}

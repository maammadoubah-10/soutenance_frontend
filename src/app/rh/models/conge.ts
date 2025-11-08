import { Personnel } from "./personnel";

export interface Conge {
  id: number;

  // Dates : l’API renvoie souvent du string ISO → garde string|Date
  dateDebut?: string | Date | null;
  dateFin?:   string | Date | null;
  dateReprise?: string | Date | null;

  typeConge?: string;
  nbreJour?: number;

  // Validations (ton back a ces champs en int)
  chefValidation?: number | boolean | null;
  csrhValidation?: number | boolean | null;  // ✅ ajout
  sgValidation?:   number | boolean | null;  // ✅ ajout
  dgValidation?:   number | boolean | null;  // ✅ ajout

  message?: string | null;
  motif?: string | null;

  pieces?: string | null;
  attestation?: string | null;
  reference?: string | null;

  anneeEncours?: number;
  anneePassee?: number;
  anneeSurpassee?: number;

  periodeEncours?: boolean;
  periodePassee?: boolean;
  periodeSurpasse?: boolean;

  personnel?: Personnel | null;
  personnelId?: number | null;
  commentaire?: string | null;
  // ⬇️ Ces 2 champs n’existent pas dans ton modèle Java.
  //    Soit tu les supprimes, soit tu les gardes en optionnel si
  //    tu y tiens côté front pour autre chose.
  date?: Date | null;
  valide?: boolean | null;
}

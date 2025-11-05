import {Personnel} from "./personnel";

export interface Presence {
  id: number,
  date: Date,
  estPresent?: boolean;
  personnel: Personnel
  dateValidation : string;
  // mois : number
  nbreJourAbsent: number
  annee: number
  userValidation: boolean
  csrhValidation: boolean
  selected?: boolean;
  mois: mois
}
// Énumération
// Énumération
export enum mois {
  Janvier = 1,
  Février = 2,
  Mars = 3,
  Avril = 4,
  Mai = 5,
  Juin = 6,
  Juillet = 7,
  Août = 8,
  Septembre = 9,
  Octobre = 10,
  Novembre = 11,
  Décembre = 12,
}

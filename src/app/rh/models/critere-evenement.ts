import {TypeEvenement} from "./type-evenement";

export interface CritereEvenement {
  id: number,
  description: string
  noteMoyenne: number
  typeEvenement: TypeEvenement
}

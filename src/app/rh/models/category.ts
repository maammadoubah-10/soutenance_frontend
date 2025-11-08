import { Unite } from "../../paiement/models/unite"

export interface Category {
  id: number,
  categorie: string
  designation: string,
  unite: Unite
}

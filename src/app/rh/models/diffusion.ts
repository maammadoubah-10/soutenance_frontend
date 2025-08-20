import {FormGroup} from "@angular/forms";

export interface Diffusion {
  id: number
  message: string
  titre: string
  // Ajoutez les nouvelles propriétés pour l'édition
  editing?: boolean; // Le "?" rend cette propriété facultative
  editForm?: FormGroup;
}

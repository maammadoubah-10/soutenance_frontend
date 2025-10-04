import {Service} from "./service";

export interface Poste {
  id: number;
  designation: string;
  description: string;
  ficheDePoste: string | null;
  chefService: boolean;

  service: Service;
  poste: Poste | null;
}

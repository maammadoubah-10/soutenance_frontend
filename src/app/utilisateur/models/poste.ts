import { Service } from "../../rh/models/service"

export interface Poste {
  id: number,
  designation: string,
  description: string, //text area
  ficheDePoste: string
  chefService: boolean,
  estChef: boolean,

  service: Service
  poste: Poste
}

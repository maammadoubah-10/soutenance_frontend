import { Service } from './service';
export interface Poste {
  id:number,
  chefService:boolean,
  description:string,
  designation:string,
  ficheDePoste:string,
  poste:Poste,
  service:Service
}

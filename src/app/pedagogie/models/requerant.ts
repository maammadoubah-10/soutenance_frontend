import { Tuteur } from "./tuteur";

export interface Requerant{
    id : number ;
    nom : string ;
    prenom : string ;
    email : string ;
    fonction : string ;
    pays : string ;
    estActif : boolean ;
    tuteur:Tuteur
}

export interface Requerants{
  nom : string ;
  prenom : string ;
  email : string ;
}

export interface RequerantDto{
    nom : string ;
    prenom : string ;
    email : string ;
    fonction : string ;
    pays : string ;
    estActif : boolean ;
}

export interface Tuteur{
    id : number ;
    nom : string ;
    prenom : string ;
    email : string ;
    adresse : string ;
    pays : string ;
    telephone : string ;
    ville:string;
    estActif : boolean ;
}

export interface Tuteurs{
  nom : string ;
  prenom : string ;
  email : string ;
}

export interface TuteurDto{
    nom : string ;
    prenom : string ;
    email : string ;
    adresse : string ;
    pays : string ;
    telephone : string ;
    ville:string;
    estActif : boolean ;
}

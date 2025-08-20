export interface Correspondant {
    id: number;
    //commun
    email: string;
    telephone : number;
    adresse: string;
    ifu: string;
    bp: string;
    siteWeb: string;

    //moral
    raisonSociale: string;
    rccm: string;

    //physique
    nom: string;
    prenom: string;

}


export interface CorrespondantDto {
    //commun
    email: string;
    telephone : number;
    adresse: string;
    ifu: string;
    bp: string;
    siteWeb: string;

    //moral
    raisonSociale: string;
    rccm: string;

    //physique
    nom: string;
    prenom: string;
}
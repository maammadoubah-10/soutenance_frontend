export enum DataStateEnum{
    ERREUR = "ERREUR",
    NADA = "AUCUNE DONNEE N'EST DISPONIBLE",
    CHARGE = "Chargé",
    CHARGEMENT = "Chargement encours ...",
    VIDE = "Vous n'avez aucun document à signer ...",
    NONSIGNE = "Vous n'avez aucun document déja signer ..."
}

export enum TypeErreur{
    SUCCESS = "SUCCESS",
    INFO = "INFO",
    WARRING = "WARRING",
    DANGER = "DANGER",
}

export enum TypeProduit {
    INTERNE = "INTERNE",
    EXTERNE = "EXTERNE",
}

export enum Methode {
    AJOUTER = "Ajouter",
    MODIFIER = "Modifier",
}

export enum TypeDemande {
    ENTREE = "ENTREE",
    SORTIE = "SORTIE",
}

export enum Statut {
    ACCEPTER = "ACCEPTE",
    REJETER = "REJETTE",
    TERMINE = "TERMINE",
    EN_COURS = "EN_COURS",
}

export interface ModelDataState<T>{
    dataState ? : DataStateEnum;
    data? : T;
    errorMessage? : string;
}

export enum CategoriesDemande{
    FOURNITURE_ATELIER = "Fournitures d'atelier",
    FOURNITURE_BUREAU = "Fournitures de bureau",
    IMOBILISATION = "Imobilisation",
    TICKET_VALEURS = "Tickets Valeurs"
}

export enum TypeImpact{
    PRELEVEMENT = "PRELEVEMENT",
    PRIME = "PRIME"
}


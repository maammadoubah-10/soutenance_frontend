
export interface UtilisateurAuthentifie {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  estAdmin: boolean;
  estActif: boolean;
}

export enum typeFonction {
  Etudiant = " ETUDIANT",

  // Ministere = "MINISTERE",

  Partenaire = "PARTENAIRE",
}

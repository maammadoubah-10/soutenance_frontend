export interface LoginResponse {
  token: string;
  email: string;
  permissions?: string[];     // selon ta réponse backend
  utilisateur?: any;          // optionnel si ton backend renvoie aussi l'objet utilisateur
}

import { Poste } from "./poste";


export interface PosteGeneral{
  poste: Poste;
  unite?: string;
  categorie?: string;
  echelon?: string;
  dateEmbauchage?: Date;
  avancementAutomatique?: Date;
  avancementAuChoix?: Date;
  dateDebauchage?: Date;
  debaucher: boolean;
} 
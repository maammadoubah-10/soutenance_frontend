import { Category } from "./category";
import { Poste } from "./poste";
import { TypeImpactSalarial } from "./type-impact-salarial";

export interface ImpactSalarial {
    id : number,
    typeImpactSalarial : TypeImpactSalarial,
    postes : Poste[],
    categories : Category[]
    montant : number,
    taux : number
}
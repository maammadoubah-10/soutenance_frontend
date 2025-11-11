// src/app/rh/models/conge.ts
import { Personnel } from "./personnel";

// Valeurs legacy possibles en base ou renvoyées par l'API
export type LegacyLike = number | boolean | null | undefined;

export enum CongeStatut {
  BROUILLON   = 'BROUILLON',
  SOUMIS      = 'SOUMIS',
  APPROUVE_RH = 'APPROUVE_RH',
  PRIS        = 'PRIS',
  CLOTURE     = 'CLOTURE',
  REJETE_RH   = 'REJETE_RH'
}

/**
 * IMPORTANT :
 * - Ne déclare cette interface QU'UNE SEULE FOIS dans tout le projet.
 * - Toutes les dates autorisent string|Date|null (pour compat API).
 * - Les champs legacy de validation gardent number|boolean|null (pour 0 / 1 / 9 / true / false / null).
 */
export interface Conge {
  id?: number;

  // Dates
  dateDebut?:   string | Date | null;
  dateFin?:     string | Date | null;
  dateReprise?: string | Date | null;

  typeConge?: string | null;
  nbreJour?: number | null;

  // Workflow unifié (si le back l'expose)
  statut?: CongeStatut | null;

  // Legacy validations
  chefValidation?: LegacyLike; // 0,1,9,true,false,null
  csrhValidation?: LegacyLike;
  sgValidation?:   LegacyLike;
  dgValidation?:   LegacyLike;

  // Divers
  message?: string | null;
  motif?: string | null;
  pieces?: string | null;
  attestation?: string | null;
  reference?: string | null;

  anneeEncours?:   number | null;
  anneePassee?:    number | null;
  anneeSurpassee?: number | null;

  periodeEncours?:  boolean | null;
  periodePassee?:   boolean | null;
  periodeSurpasse?: boolean | null;

  personnel?: Personnel | null;
  personnelId?: number | null;

  commentaire?: string | null;
  // Historique compat front
  date?: Date | null;
  valide?: boolean | null;
}

/* ===== Helpers statut unifié (compat legacy) ===== */

function isFlag(v: LegacyLike, n: 0 | 1): boolean {
  // On accepte 0/1 ou boolean équivalents
  if (v === n) return true;
  if (n === 1 && v === true) return true;
  if (n === 0 && v === false) return true;
  return false;
}
function isPending(v: LegacyLike): boolean {
  return v === 9;
}

/** Déduit le statut unifié si `statut` absent */
export function computeEffectiveStatus(c: Conge): CongeStatut {
  if (c?.statut) return c.statut;

  // Rejet si au moins un 0/false
  if (isFlag(c?.chefValidation,0) || isFlag(c?.csrhValidation,0)
   || isFlag(c?.sgValidation,0)   || isFlag(c?.dgValidation,0)) {
    return CongeStatut.REJETE_RH;
  }

  // Approve si au moins un 1/true (et aucun rejet)
  if (isFlag(c?.chefValidation,1) || isFlag(c?.csrhValidation,1)
   || isFlag(c?.sgValidation,1)   || isFlag(c?.dgValidation,1)) {
    return CongeStatut.APPROUVE_RH;
  }

  // En cours si au moins un "9"
  if (isPending(c?.chefValidation) || isPending(c?.csrhValidation)
   || isPending(c?.sgValidation)   || isPending(c?.dgValidation)) {
    return CongeStatut.SOUMIS;
  }

  // Si une référence existe, on considère SOUMIS
  if (c?.reference) return CongeStatut.SOUMIS;

  return CongeStatut.BROUILLON;
}

export function statusBadgeClass(c: Conge): string {
  const s = computeEffectiveStatus(c);
  switch (s) {
    case CongeStatut.BROUILLON:   return 'badge bg-secondary';
    case CongeStatut.SOUMIS:      return 'badge bg-info';
    case CongeStatut.APPROUVE_RH: return 'badge bg-success';
    case CongeStatut.PRIS:        return 'badge bg-primary';
    case CongeStatut.CLOTURE:     return 'badge bg-dark';
    case CongeStatut.REJETE_RH:   return 'badge bg-danger';
    default:                      return 'badge bg-secondary';
  }
}

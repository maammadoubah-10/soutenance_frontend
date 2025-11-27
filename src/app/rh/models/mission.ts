// src/app/rh/models/mission.ts
import { Personnel } from "./personnel";
import { Imputation } from "./imputation";
import { MissionnaireExterne } from "./missionnaire-externe";
import { TypeMission } from "./type-mission";

export enum MissionStatut {
  BROUILLON   = 'BROUILLON',
  SOUMIS      = 'SOUMIS',
  APPROUVE_RH = 'APPROUVE_RH',

  APPROUVEE   = 'APPROUVEE',
  PRIS        = 'PRIS',
  TERMINEE    = 'TERMINEE',
  CLOTURE     = 'CLOTURE',
  CLOTUREE    = 'CLOTUREE',
  REJETE_RH   = 'REJETE_RH',
  REJETEE     = 'REJETEE',
}


export interface Mission {
  id: number;

  reference?: string;
  objet?: string;
  motif?: string;
  message?: string;

  // 👉 utilisés dans detailpersonnel.component.html
  accompagne?: string;
  conducteur?: Personnel | null;

  personnels: Personnel[]
  //personnel?: Personnel | null;

  dateDebut?: string | Date;
  dateFin?: string | Date;
  nbreJour?: number;

  typeDemande?: string;

  moyenTransport?: string;
  moyenDeplacement?: string;

  imputation?: Imputation | null;
  typeMission?: TypeMission | null;
  missionnaireExternes?: MissionnaireExterne[];

  rapport?: string | null;
  duree?: string | null;
  pieces?: any;
  attestation?: string | null;

  // champs de statut "bruts" venant du back
  statut?: string | null;
  status?: string | null;
  etat?: string | null;

  // validations numériques éventuelles
  chefValidation?: number;
  csrhValidation?: number;
  sgValidation?: number;
  dgValidation?: number;
  personnel : Personnel
  isTodayBetweenDates?: boolean;
}

// --- Helpers statut --- //
// --- Helpers statut --- //

function normalizeStatus(raw?: string | null): MissionStatut | null {
  if (!raw) return null;
  const up = raw.toUpperCase();

  switch (up) {
    case 'BROUILLON':       return MissionStatut.BROUILLON;
    case 'SOUMIS':          return MissionStatut.SOUMIS;
    case 'APPROUVE_RH':     return MissionStatut.APPROUVE_RH;
    case 'APPROUVEE':       return MissionStatut.APPROUVEE;
    case 'PRIS':
    case 'PRISE':           return MissionStatut.PRIS;
    case 'TERMINE':
    case 'TERMINEE':        return MissionStatut.TERMINEE;
    case 'CLOTURE':
    case 'CLOTUREE':        return MissionStatut.CLOTURE;
    case 'REJETE':
    case 'REJETEE':
    case 'REJETE_RH':       return MissionStatut.REJETE_RH;
    default:                return null;
  }
}

function isFlag(v: number | null | undefined, n: 0 | 1): boolean {
  if (v === n) return true;
  return false;
}
function isPending(v: number | null | undefined): boolean {
  return v === 9;
}

/**
 * Status métier unifié (comme pour congé)
 */
export function computeEffectiveMissionStatus(m: Mission): MissionStatut {
  // 1) On privilégie toujours le statut texte envoyé par le back
  const raw = (m.statut || m.status || m.etat || '').toString();
  const norm = normalizeStatus(raw);
  if (norm) return norm;

  // 2) Sinon, on reconstruit à partir des validations (ancien comportement)
  if (
    isFlag(m.chefValidation, 0) ||
    isFlag(m.csrhValidation, 0) ||
    isFlag(m.sgValidation, 0) ||
    isFlag(m.dgValidation, 0)
  ) {
    return MissionStatut.REJETE_RH;
  }

  if (
    isFlag(m.chefValidation, 1) ||
    isFlag(m.csrhValidation, 1) ||
    isFlag(m.sgValidation, 1) ||
    isFlag(m.dgValidation, 1)
  ) {
    return MissionStatut.APPROUVE_RH;
  }

  if (
    isPending(m.chefValidation) ||
    isPending(m.csrhValidation) ||
    isPending(m.sgValidation) ||
    isPending(m.dgValidation)
  ) {
    return MissionStatut.SOUMIS;
  }

  if (m.reference) {
    return MissionStatut.SOUMIS;
  }

  return MissionStatut.BROUILLON;
}


/**
 * Classe Bootstrap de badge (utilisée dans mission.component et mes-missions)
 */
export function missionBadgeClass(m: Mission): string {
  const s = computeEffectiveMissionStatus(m);

  switch (s) {
    case MissionStatut.BROUILLON:
      return 'badge bg-secondary-subtle text-secondary';

    case MissionStatut.SOUMIS:
      return 'badge bg-warning-subtle text-warning';

    case MissionStatut.APPROUVE_RH:
    case MissionStatut.APPROUVEE:
      return 'badge bg-info-subtle text-info';

    case MissionStatut.PRIS:
    case MissionStatut.TERMINEE:
      return 'badge bg-primary-subtle text-primary';

    case MissionStatut.CLOTURE:
    case MissionStatut.CLOTUREE:
      return 'badge bg-success-subtle text-success';

    case MissionStatut.REJETE_RH:
    case MissionStatut.REJETEE:
      return 'badge bg-danger-subtle text-danger';

    default:
      return 'badge bg-light text-muted border';
  }
}

/** Alias pour l’ancien nom */
export const missionStatusBadgeClass = missionBadgeClass;

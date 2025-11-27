// src/app/rh-dashboard/services/rh-dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminAlert {
  nomComplet: string;
  type: string;
  dateFin: string | Date | null;
  statut: string;
}

/** DTO principal reçu depuis le backend RH */
export interface RhDashboardDto {
  kpi: {
    totalPersonnel: number;   // admin : effectif total, perso : 1 ou 0 (contrat actif)
    postesOuverts: number;    // admin : postes vacants, perso : solde congés
    enAbsence: number;        // admin : nb absents, perso : jours pointés (présences)
    tauxTurnover: number;     // admin : % turnover, perso : missions en cours
  };
  headcount: {
    labels: string[];
    data: number[];
  };
  hiresDepartures: {
    labels: string[];
    hires: number[];          // admin : embauches, perso : missions
    departures: number[];     // admin : fins de contrat, perso : congés
  };
  absence: {
    rate: number;
  };
  departments: {
    labels: string[];         // admin : services, perso : types de congés
    values: number[];
  };
  alertes?: AdminAlert[];
}

@Injectable({ providedIn: 'root' })
export class RhDashboardService {
  private baseUrl = environment.hostmicroservicepersonnel; // ex: http://localhost:9002/rh/
  private urlAdmin = `${this.baseUrl}dashboard`;
  private urlMe    = `${this.baseUrl}dashboard/moi`;

  constructor(private http: HttpClient) {}

  /** Dashboard RH Admin */
  getDashboard(): Observable<RhDashboardDto> {
    return this.http.get<RhDashboardDto>(this.urlAdmin);
  }

  /** Dashboard pour le personnel connecté */
  getMyDashboard(): Observable<RhDashboardDto> {
    return this.http.get<RhDashboardDto>(this.urlMe);
  }
}

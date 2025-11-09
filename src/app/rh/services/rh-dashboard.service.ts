// src/app/rh-dashboard/services/rh-dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";

export interface RhDashboardDto {
  kpi: {
    totalPersonnel: number;   // → Contrat actif (1/0)
    postesOuverts: number;    // → Solde congés
    enAbsence: number;        // → Jours pointés (mois)
    tauxTurnover: number;     // → Missions en cours
  };
  headcount: { labels: string[]; data: number[] }; // Présence 6 mois (jours pointés)
  hiresDepartures: { labels: string[]; hires: number[]; departures: number[] }; // Missions vs Congés
  absence: { rate: number }; // Taux d’absence du mois
  departments: { labels: string[]; values: number[] }; // Types de congés
}

@Injectable({ providedIn: 'root' })
export class RhDashboardService {
  private baseUrl = environment.hostmicroservicepersonnel; // ex: http://localhost:9002/rh/
  private urlAdmin = `${this.baseUrl}dashboard`;
  private urlMe    = `${this.baseUrl}dashboard/moi`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<RhDashboardDto> {
    return this.http.get<RhDashboardDto>(this.urlAdmin);
  }

  /** Nouveau: dashboard pour le personnel connecté */
  getMyDashboard(): Observable<RhDashboardDto> {
    return this.http.get<RhDashboardDto>(this.urlMe);
  }
}

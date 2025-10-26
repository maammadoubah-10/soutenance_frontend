import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";

export interface RhDashboardDto {
  kpi: {
    totalPersonnel: number;
    postesOuverts: number;
    enAbsence: number;
    tauxTurnover: number;
  };
  headcount: {
    labels: string[];
    data: number[];
  };
  hiresDepartures: {
    labels: string[];
    hires: number[];
    departures: number[];
  };
  absence: { rate: number };
  departments: { labels: string[]; values: number[] };
}

@Injectable({ providedIn: 'root' })
export class RhDashboardService {
  // base déjà suffixée par /rh/
  private baseUrl = environment.hostmicroservicepersonnel; // ex: http://localhost:9002/rh/
  // si ton contrôleur expose GET /rh/dashboard :
  private url = `${this.baseUrl}dashboard`;
  // si c'est /api/rh/dashboard, mets plutôt :
  // private url = `${this.baseUrl}api/rh/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<RhDashboardDto> {
    return this.http.get<RhDashboardDto>(this.url);
  }
}

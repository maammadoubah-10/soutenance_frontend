// src/app/rh/services/presence.service.ts
import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, firstValueFrom } from "rxjs";
import { Presence } from "../models/presence";

@Injectable({ providedIn: 'root' })
export class PresenceService {
  // 👉 environment.hostmicroservicepersonnel DOIT être "http://localhost:9002/rh"
  public readonly contextPath = `${environment.hostmicroservicepersonnel.replace(/\/$/, '')}/presences`;

  constructor(private httpClient: HttpClient) {}

  listerPresenceALLPage(
    page: number,
    size: number,
    sortField: string,
    sortDir: 'asc' | 'desc',
    mois?: number,
    annee?: number,
    serviceId?: number
  ) {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sortField},${sortDir}`);
    if (mois != null) params = params.set('mois', mois);
    if (annee != null) params = params.set('annee', annee);
    if (serviceId != null) params = params.set('serviceId', serviceId);

    return this.httpClient.get<any>(`${this.contextPath}/rechercher`, { observe: 'response', params });
  }

  listerPresenceMarqueALLPage(
    page: number,
    size: number,
    sortField: string,
    sortDir: 'asc' | 'desc',
    mois?: number,
    annee?: number,
    serviceId?: number
  ) {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sortField},${sortDir}`);
    if (mois != null) params = params.set('mois', mois);
    if (annee != null) params = params.set('annee', annee);
    if (serviceId != null) params = params.set('serviceId', serviceId);

    return this.httpClient.get<any>(`${this.contextPath}/rechercher/valider`, { observe: 'response', params });
  }

  async getPresenceIdIfExists(personnelId: number, mois: number): Promise<number | null> {
    const url = `${this.contextPath}/personnel/${personnelId}/${mois}`;
    try {
      const resp = await firstValueFrom(this.httpClient.get<any>(url, { observe: 'response' }));
      const list = resp.body as any[];
      if (!Array.isArray(list) || list.length === 0) return null;
      const ext = list[0];
      const maybeId = ext?.id ?? ext?.presenceId ?? ext?.presenceID ?? ext?._id;
      return (typeof maybeId === 'number') ? maybeId : Number.isFinite(Number(maybeId)) ? Number(maybeId) : null;
    } catch {
      return null;
    }
  }

  creerPresence(personnelId: number, nbreJourAbsent: number, mois: number): Observable<Presence> {
    const params = new HttpParams()
      .set('personnelId', personnelId)
      .set('mois', mois)
      .set('nbreJourAbsent', nbreJourAbsent ?? 0);
    return this.httpClient.post<Presence>(`${this.contextPath}`, null, { params });
  }

  modifierPresence(id: number, nbreJourAbsent: number): Observable<Presence> {
    const params = new HttpParams().set('nbreJourAbsent', nbreJourAbsent ?? 0);
    return this.httpClient.patch<Presence>(`${this.contextPath}/${id}`, null, { params });
  }

  annulerValidationPresence(id: number, _data: any): Observable<Presence> {
    return this.httpClient.patch<Presence>(`${this.contextPath}/${id}/invalide`, null);
  }

  validerALLPresence(presenceIds: number[], _data: any): Observable<Presence> {
    const params = new HttpParams().set('presenceIds', presenceIds.join(','));
    return this.httpClient.patch<Presence>(`${this.contextPath}/confirmeAll`, null, { params });
  }

  annulervalidationALLPresence(presenceIds: number[], _data: any): Observable<Presence> {
    const params = new HttpParams().set('presenceIds', presenceIds.join(','));
    return this.httpClient.patch<Presence>(`${this.contextPath}/invalideAll`, null, { params });
  }

  supprimerPresence(id: number) {
    return this.httpClient.delete<any>(`${this.contextPath}/${id}`);
  }
}

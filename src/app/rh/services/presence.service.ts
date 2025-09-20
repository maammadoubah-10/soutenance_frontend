// src/app/rh/services/presence.service.ts
import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, firstValueFrom } from "rxjs";
import { Presence } from "../models/presence";

@Injectable({ providedIn: 'root' })
export class PresenceService {
  public contextPath: string = environment.hostmicroservicepersonnel + "presences";

  constructor(private httpClient: HttpClient) {}

  // Liste paginée (toutes)
  listerPresenceALLPage(
    page: number,
    size: number,
    _sortField: string,   // inutilisé pour l’instant
    _sortDir: 'asc' | 'desc',
    mois?: number,
    annee?: number,
    serviceId?: number
  ) {
    const url =
      `${this.contextPath}/rechercher?page=${page}&size=${size}` +
      (mois !== undefined ? `&mois=${mois}` : '') +
      (annee !== undefined ? `&annee=${annee}` : '') +
      (serviceId !== undefined ? `&serviceId=${serviceId}` : '');
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  // Liste paginée (validées CSRH)
  listerPresenceMarqueALLPage(
    page: number,
    size: number,
    _sortField: string,
    _sortDir: 'asc' | 'desc',
    mois?: number,
    annee?: number,
    serviceId?: number
  ) {
    const url =
      `${this.contextPath}/rechercher/valider?page=${page}&size=${size}` +
      (mois !== undefined ? `&mois=${mois}` : '') +
      (annee !== undefined ? `&annee=${annee}` : '') +
      (serviceId !== undefined ? `&serviceId=${serviceId}` : '');
    return this.httpClient.get<any>(url, { observe: 'response' });
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

  // Création
  creerPresence(personnelId: number, nbreJourAbsent: number, mois: number): Observable<Presence> {
    const url = `${this.contextPath}?nbreJourAbsent=${nbreJourAbsent}&personnelId=${personnelId}&mois=${mois}`;
    return this.httpClient.post<Presence>(url, null);
  }

  // Validation/MàJ (CSRH)
  modifierPresence(id: number, nbreJourAbsent: number): Observable<Presence> {
    const url = `${this.contextPath}/${id}?nbreJourAbsent=${nbreJourAbsent}`;
    return this.httpClient.patch<Presence>(url, null);
  }

  // Invalidation
  annulerValidationPresence(id: number, data: any): Observable<Presence> {
    return this.httpClient.patch<Presence>(`${this.contextPath}/${id}/invalide`, data);
  }

  // Validation en masse
  validerALLPresence(presenceIds: number[], data: any): Observable<Presence> {
    const params = new HttpParams().set('presenceIds', presenceIds.join(','));
    return this.httpClient.patch<Presence>(`${this.contextPath}/confirmeAll`, data, { params });
  }

  // Invalidation en masse
  annulervalidationALLPresence(presenceIds: number[], data: any): Observable<Presence> {
    const params = new HttpParams().set('presenceIds', presenceIds.join(','));
    return this.httpClient.patch<Presence>(`${this.contextPath}/invalideAll`, data, { params });
  }

  supprimerPresence(id: number) {
    return this.httpClient.delete<any>(`${this.contextPath}/${id}`);
  }

  voirPresence(id: number) {
    return this.httpClient.get<any>(`${this.contextPath}/${id}`);
  }
}

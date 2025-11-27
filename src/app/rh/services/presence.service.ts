// src/app/rh/services/presence.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, firstValueFrom } from "rxjs";
import { environment } from "../../../environments/environment";
import { Presence } from "../models/presence";

@Injectable({ providedIn: 'root' })
export class PresenceService {
  /** Base attendue : environment.hostmicroservicepersonnel = "http://localhost:9002/rh" */
  private readonly base = `${environment.hostmicroservicepersonnel}`.replace(/\/$/, '');
  public readonly contextPath = `${this.base}/presences`;

  constructor(private httpClient: HttpClient) {}

  /** Listing global avec recherche/filtre (pagination) */
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

  /** Listing des présences validées (pagination) */
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

  /** Listing par personnel (pagination) */
  listerPresencePersonnel(
    personnelId: number,
    page = 0,
    size = 5,
    sortDir: 'asc' | 'desc' = 'desc'
  ) {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `id,${sortDir}`);

    return this.httpClient.get<any>(`${this.contextPath}/personnel/${personnelId}`, { observe: 'response', params });
  }

  /** Vérifie si une présence existe pour (personnel, mois) et retourne l'id si trouvé. */
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

  /** Création */
  creerPresence(personnelId: number, nbreJourAbsent: number, mois: number): Observable<Presence> {
    const params = new HttpParams()
      .set('personnelId', personnelId)
      .set('mois', mois)
      .set('nbreJourAbsent', nbreJourAbsent ?? 0);
    return this.httpClient.post<Presence>(`${this.contextPath}`, null, { params });
  }

  /** Modification (nbreJourAbsent) */
  modifierPresence(id: number, nbreJourAbsent: number): Observable<Presence> {
    const params = new HttpParams().set('nbreJourAbsent', nbreJourAbsent ?? 0);
    return this.httpClient.patch<Presence>(`${this.contextPath}/${id}`, null, { params });
  }

  /** Validation / Invalidation */
  annulerValidationPresence(id: number): Observable<Presence> {
    return this.httpClient.patch<Presence>(`${this.contextPath}/${id}/invalide`, null);
  }

  validerALLPresence(presenceIds: number[]): Observable<Presence> {
    const params = new HttpParams().set('presenceIds', presenceIds.join(','));
    return this.httpClient.patch<Presence>(`${this.contextPath}/confirmeAll`, null, { params });
  }

  annulervalidationALLPresence(presenceIds: number[]): Observable<Presence> {
    const params = new HttpParams().set('presenceIds', presenceIds.join(','));
    return this.httpClient.patch<Presence>(`${this.contextPath}/invalideAll`, null, { params });
  }

  /** Suppression */
  supprimerPresence(id: number) {
    return this.httpClient.delete<any>(`${this.contextPath}/${id}`);
  }


 /** Mes présences (paginated) via /presences/moi (back lit le token) */
listerMesPresences(
  page = 0,
  size = 10,
  sortField = 'dateValidation',
  sortDir: 'asc' | 'desc' = 'desc'
) {
  const params = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('sort', `${sortField},${sortDir}`);

  return this.httpClient.get<any>(
    `${this.contextPath}/moi`,
    { observe: 'response', params }
  );
}


/** Génération des feuilles de présence pour un mois/année */
genererPourMois(mois: number, annee?: number) {
  let params = new HttpParams().set('mois', mois);
  if (annee != null) {
    params = params.set('annee', annee);
  }
  return this.httpClient.post<Presence[]>(`${this.contextPath}/generer`, null, { params });
}


}

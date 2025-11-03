import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ModeDePaiement} from "../models/mode-de-paiement";
import { PageResponse } from '../../paiement/models/PageResponse';

@Injectable({
  providedIn: 'root'
})
export class ModeDePaiementService {

  private readonly API_URL = `${environment.hostmicroservicepaie}mode/paiement`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste paginée des modes de paiement
   */
  public listerModeDePaiementPage(page: number = 0, size: number = 20, sort: string = 'designation,asc'): Observable<PageResponse<ModeDePaiement>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<PageResponse<ModeDePaiement>>(this.API_URL, { params });
  }

  /**
   * Recherche des modes de paiement avec filtrage
   */
  public rechercheModeDePaiement(designation: string): Observable<ModeDePaiement[]> {
    const params = new HttpParams().set('search', designation);
    return this.http.get<ModeDePaiement[]>(`${this.API_URL}/filtrer`, { params });
  }

  /**
   * Récupère un mode de paiement par son ID
   */
  public obtenirModeDePaiementParId(id: number): Observable<ModeDePaiement> {
    return this.http.get<ModeDePaiement>(`${this.API_URL}/${id}`);
  }

  /**
   * Crée un nouveau mode de paiement
   */
  public creerModeDePaiement(data: { designation: string }): Observable<ModeDePaiement> {
    return this.http.post<ModeDePaiement>(this.API_URL, data);
  }

  /**
   * Modifie un mode de paiement existant
   */
  public modifierModeDePaiement(id: number, data: { designation: string }): Observable<ModeDePaiement> {
    return this.http.patch<ModeDePaiement>(`${this.API_URL}/${id}`, data);
  }

  /**
   * Supprime un mode de paiement
   */
  public supprimerModeDePaiement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}

// src/app/rh/services/contrat.service.ts
import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Contrat } from "../models/contrat";
import { catchError } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class ContratService {
  // Base = http://localhost:9002/rh/contrat
  public contextPath: string = `${environment.hostmicroservicepersonnel.replace(/\/$/, '')}/contrat`;

  constructor(private httpClient: HttpClient) {}

  /** Liste paginée (si exposée côté backend) */
  public listerContratPage(page: number, size: number, sort: string): Observable<Contrat> {
    const url = `${this.contextPath}/all?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Contrat>(url, { observe: 'response' });
  }

  public recherchePersonnel(nom: string): Observable<any> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  /** Créer un contrat pour un personnel */
  creerContrat(personnelId: number, formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.contextPath}/create/${personnelId}`, formData);
  }

  public modifierContrat(id: any, data: any): Observable<Contrat> {
    return this.httpClient.patch<Contrat>(`${this.contextPath}/update/${id}`, data);
  }

  public supprimerContrat(id: number) {
    return this.httpClient.delete<any>(`${this.contextPath}/${id}`);
  }

  /** Tous les contrats d’un personnel (si exposé) */
  public voirAllContratPersonnel(id: number) {
    return this.httpClient.get<any>(`${this.contextPath}/latest/${id}`);
  }

  /** Détail d’un contrat par id */
  public voirUnContratPersonnel(id: number) {
    return this.httpClient.get<any>(`${this.contextPath}/${id}`);
  }

  /** Avenants d’un contrat */
  public listerAvenantContrat(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/${id}/avenants?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  /** Téléchargement fichier */
  telechargerFichierContrat(contratId: number): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${contratId}/telecharger/`;
    const authToken = sessionStorage.getItem("token");
    if (!authToken) throw new Error("Authorization token not found");
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${authToken}` });
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers })
      .pipe(catchError(() => { throw new Error('Erreur HTTP lors du téléchargement.'); }));
  }
}

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Demande } from '../models/demande';

const jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

/** Petite interface utilitaire pour les réponses paginées Spring Data */
export interface PageResp<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;      // page courante (0-based)
  size: number;        // taille page
  sort?: any;
}

@Injectable({ providedIn: 'root' })
export class DemandeService {
  public contextPath = environment.hostmicroservicepersonnel + 'demandes';

  constructor(private http: HttpClient) {}

  /** ----- Téléchargements (Blob) ----- */
  telechargerFichier(demandeId: number): Observable<Blob> {
    const url = `${this.contextPath}/${demandeId}/telecharger`;
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error('Authorization token not found');

    return this.http.get(url, {
      responseType: 'blob',
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    });
  }

  telechargerFichierDemandeApresValidationDg(demandeId: number): Observable<Blob> {
    const url = `${this.contextPath}/${demandeId}/telechargerDemande`;
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error('Authorization token not found');

    return this.http.get(url, {
      responseType: 'blob',
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    });
  }

  /** ----- Mes demandes paginées ----- */
  listerMesDemandes(
    page = 0,
    size = 10,
    sort = 'id,desc'
  ): Observable<HttpResponse<PageResp<any>>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sort', String(sort));
    // Le token partira via ton HttpInterceptor si présent
    return this.http.get<PageResp<any>>(`${this.contextPath}/moi`, {
      observe: 'response',
      params
    });
  }

  /** ----- Listes diverses (réponses paginées) ----- */
  listerDemandePage(
    page: number,
    size: number,
    sort: string
  ): Observable<HttpResponse<PageResp<Demande>>> {
    const url = `${this.contextPath}/encours`;
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sort', String(sort));
    return this.http.get<PageResp<Demande>>(url, { observe: 'response', params });
  }

  listerDemandeRefusePage(
    page: number,
    size: number,
    sort: string
  ): Observable<HttpResponse<PageResp<Demande>>> {
    const url = `${this.contextPath}/rejetees`;
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sort', String(sort));
    return this.http.get<PageResp<Demande>>(url, { observe: 'response', params });
  }

  listerDemandeValidePage(
    page: number,
    size: number,
    sort: string
  ): Observable<HttpResponse<PageResp<Demande>>> {
    const url = `${this.contextPath}/validees`;
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sort', String(sort));
    return this.http.get<PageResp<Demande>>(url, { observe: 'response', params });
  }

  listerDemandePersonnel(
    personnelId: number,
    page: number,
    size: number,
    sort: string
  ): Observable<HttpResponse<PageResp<Demande>>> {
    const url = `${this.contextPath}/personnel/${personnelId}`;
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sort', String(sort));
    return this.http.get<PageResp<Demande>>(url, { observe: 'response', params });
  }

  listerDemandeParService(
    chefId: number,
    page: number,
    size: number,
    sort: string
  ): Observable<HttpResponse<PageResp<Demande>>> {
    const url = `${this.contextPath}/demandes/${chefId}`;
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sort', String(sort));
    return this.http.get<PageResp<Demande>>(url, { observe: 'response', params });
  }

  rechercheDemandePage(
    sort: string,
    designation: string
  ): Observable<HttpResponse<PageResp<Demande>>> {
    const url = `${this.contextPath}`;
    const params = new HttpParams()
      .set('sort', String(sort))
      .set('designation', String(designation));
    return this.http.get<PageResp<Demande>>(url, { observe: 'response', params });
  }

  rechercheDemande(nom: string): Observable<HttpResponse<PageResp<Demande>>> {
    const url = `${this.contextPath}`;
    const params = new HttpParams().set('nom', String(nom));
    return this.http.get<PageResp<Demande>>(url, { observe: 'response', params });
  }

  /** ----- Création / modification / suppression ----- */
  creerDemande(data: FormData | any): Observable<Demande> {
    return this.http.post<Demande>(this.contextPath, data);
  }

  modifierDemandePersonnel(
    dateDebut: Date,
    dateFin: Date,
    demandeId: number,
    nbreJour: number
  ): Observable<Demande> {
    const url = `${this.contextPath}/${demandeId}/chefValidation/oui`;
    const params = new HttpParams()
      .set('dateDebut', String(dateDebut))
      .set('dateFin', String(dateFin))
      .set('nbreJour', String(nbreJour));
    return this.http.patch<Demande>(url, null, { params });
  }

  modifierDemandeCsrhPersonnel(
    demandeId: number,
    dateDebut: string,
    dateFin: string,
    nbreJour: number
  ): Observable<Demande> {
    const url = `${this.contextPath}/csrh/oui`;
    const params = new HttpParams()
      .set('demandeId', String(demandeId))
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin)
      .set('nbreJour', String(nbreJour));
    return this.http.patch<Demande>(url, null, { params });
  }

  refusDemandeCsrhPersonnel(demandeId: number, message: string): Observable<Demande> {
    const url = `${this.contextPath}/${demandeId}/csrhValidation/non`;
    const params = new HttpParams().set('message', message);
    return this.http.patch<Demande>(url, null, { params });
  }

  refusDemandePersonnel(demandeId: number, message: string): Observable<Demande> {
    const url = `${this.contextPath}/${demandeId}/chefValidation/non`;
    const params = new HttpParams().set('message', message);
    return this.http.patch<Demande>(url, null, { params });
  }

  validerDemandeSgPersonnel(demandeId: number): Observable<Demande> {
    const url = `${this.contextPath}/sg/oui`;
    const params = new HttpParams().set('demandeId', String(demandeId));
    return this.http.patch<Demande>(url, null, { params });
  }

  refuserDemandeSgPersonnel(demandeId: number, message: string): Observable<Demande> {
    const url = `${this.contextPath}/sg/non`;
    const params = new HttpParams()
      .set('demandeId', String(demandeId))
      .set('message', message);
    return this.http.patch<Demande>(url, null, { params });
  }

  validerDemandeDgPersonnel(demandeId: number): Observable<Demande> {
    const url = `${this.contextPath}/dg/oui`;
    const params = new HttpParams().set('demandeId', String(demandeId));
    return this.http.patch<Demande>(url, null, { params });
  }

  refuserDemandeDgPersonnel(demandeId: number, message: string): Observable<Demande> {
    const url = `${this.contextPath}/dg/non`;
    const params = new HttpParams()
      .set('demandeId', String(demandeId))
      .set('message', message);
    return this.http.patch<Demande>(url, null, { params });
  }

  modifierDemande(id: number, data: FormData | any): Observable<Demande> {
    return this.http.patch<Demande>(`${this.contextPath}/${id}`, data);
  }

  supprimerDemande(id: number): Observable<any> {
    // ⚠️ ton backend écoute sur DELETE /demandes/delete/{id}
    return this.http.delete<any>(`${this.contextPath}/delete/${id}`);
  }

  voirDemande(id: number): Observable<Demande> {
    return this.http.get<Demande>(`${this.contextPath}/${id}`);
  }
}

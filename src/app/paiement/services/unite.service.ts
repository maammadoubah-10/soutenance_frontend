import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Unite } from '../models/unite';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageResponse } from '../models/PageResponse';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniteService {

  private readonly API_URL = `${environment.hostmicroservicepaie}unites`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste paginée des modes de paiement
   */
  public listerUnitePage(page: number = 0, size: number = 20, sort: string = 'designation,asc'): Observable<PageResponse<Unite>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<PageResponse<Unite>>(`${this.API_URL}/paginated`, { params });
  }

  public listerUnite(): Observable<Unite[]> {
    
    return this.http.get<Unite[]>(`${this.API_URL}/tous`, environment.httpOptions);
  }

  /**
   * Recherche des modes de paiement avec filtrage
   */
  public rechercheUnite(designation: string): Observable<Unite[]> {
    const params = new HttpParams().set('search', designation);
    return this.http.get<Unite[]>(`${this.API_URL}/search`, { params });
  }

  /**
   * Récupère un mode de paiement par son ID
   */
  public obtenirUniteParId(id: number): Observable<Unite> {
    return this.http.get<Unite>(`${this.API_URL}/${id}`);
  }

  /**
   * Crée un nouveau mode de paiement
   */
  public creerUnite(data: { designation: string }): Observable<Unite> {
    return this.http.post<Unite>(this.API_URL, data);
  }

  /**
   * Modifie un mode de paiement existant
   */
  public modifierUnite(id: number, data: { designation: string }): Observable<Unite> {
    return this.http.put<Unite>(`${this.API_URL}/${id}`, data);
  }

  /**
   * Supprime un mode de paiement
   */
  public supprimerUnite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}


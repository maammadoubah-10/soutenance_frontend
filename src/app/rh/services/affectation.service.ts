import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Affectation } from '../models/affectation';
import { AffectationDto } from '../models/affectation-dto';

@Injectable({ providedIn: 'root' })
export class AffectationService {
  // Base = http://localhost:9002/rh/affectations
  public contextPath: string = environment.hostmicroservicepersonnel + 'affectations';

  constructor(private http: HttpClient) {}

  lister(page = 0, size = 10, sort = 'desc'): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size).set('sort', sort);
    // @ts-ignore
    return this.http.get<any>(this.contextPath, { observe: 'response', params });
  }

  listerParPersonnel(personnelId: number, page = 0, size = 10, sort = 'desc'): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size).set('sort', sort);
    // @ts-ignore
    return this.http.get<any>(`${this.contextPath}/personnel/${personnelId}`, { observe: 'response', params });
  }

  voir(id: number): Observable<Affectation> {
    return this.http.get<Affectation>(`${this.contextPath}/${id}`);
  }

  creer(dto: AffectationDto): Observable<Affectation> {
    return this.http.post<Affectation>(this.contextPath, dto);
  }

  modifier(id: number, dto: AffectationDto): Observable<Affectation> {
    return this.http.patch<Affectation>(`${this.contextPath}/${id}`, dto);
  }

  supprimer(id: number): Observable<any> {
    return this.http.delete(`${this.contextPath}/${id}`);
  }

  // Optionnel : route alternative existante côté backend
  affecter(personnelId: number, posteId: number, dateDebut: string): Observable<Affectation> {
    return this.http.post<Affectation>(
      `${this.contextPath}/personnel/${personnelId}/poste/${posteId}`,
      { dateDebut }
    );
  }
}

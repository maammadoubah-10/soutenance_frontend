import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Priorite } from '../models/priorite';
import { Courrier, CourrierDto } from 'src/app/courrier/models/courrier';

@Injectable({
  providedIn: 'root'
})
export class PrioriteService {
  private _url:string = environment.hostmicroservicecourrier + "priorite";

  constructor(private http: HttpClient) { }

  createPriorite(priorite: Priorite): Observable<Priorite> {
    return this.http.post<Priorite>(`${this._url}`, priorite);
  }

  updatePriorite(id: number, priorite: Priorite): Observable<Priorite> {
    return this.http.put<Priorite>(`${this._url}/${id}`, priorite);
  }

  deletePriorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this._url}/${id}`);
  }

  getAllPriorites(): Observable<Priorite[]> {
    return this.http.get<Priorite[]>(`${this._url}`);
  }

  getPrioriteById(id: number): Observable<Priorite> {
    return this.http.get<Priorite>(`${this._url}/${id}`);
  }

  // getAllCourriersByPriorite(prioriteId: number): Observable<Courrier[]> {
  //   return this.http.get<Priorite[]>(`${this._url}/${prioriteId}/courriers`);
  // }
}

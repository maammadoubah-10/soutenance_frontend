import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etat } from '../models/etat';

@Injectable({
  providedIn: 'root'
})
export class EtatService {

  private _url:string = environment.hostmicroservicepaie+"etats"

  constructor(private http: HttpClient) {

  }

  getEtats(): Observable<Etat[]> {
    return this.http.get<Etat[]>(this._url+"/", environment.httpOptions)
  }

  getEtat(id:number): Observable<Etat> {
    return this.http.get<Etat>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createEtat(data:any):Observable<Etat> {
    return this.http.post<Etat>(this._url+"/", data, environment.httpOptions)
  }

  updateEtat(id:number, data:any):Observable<Etat> {
    return this.http.patch<Etat>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteEtat(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

}

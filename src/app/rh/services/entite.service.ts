import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entite } from '../models/entite';
import { Personnel } from '../models/personnel';
import { Etat } from '../models/etat';

@Injectable({
  providedIn: 'root'
})
export class EntiteService {

  private _url:string = environment.hostmicroservicepaie+"entites"

  constructor(private http: HttpClient) {

  }

  getEntites(): Observable<Entite[]> {
    return this.http.get<Entite[]>(this._url+"/", environment.httpOptions)
  }

  getEntite(id:number): Observable<Entite> {
    return this.http.get<Entite>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createEntite(data:any):Observable<Entite> {
    return this.http.post<Entite>(this._url+"/", data, environment.httpOptions)
  }

  updateEntite(id:number, data:any):Observable<Entite> {
    return this.http.patch<Entite>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteEntite(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

  /**********************/
  getPersonnels(id:number): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(`${this._url}/${id}/personnels`, environment.httpOptions)
  }

  getEtats(id:number): Observable<Etat[]> {
    return this.http.get<Etat[]>(`${this._url}/${id}/etats`, environment.httpOptions)
  }

}

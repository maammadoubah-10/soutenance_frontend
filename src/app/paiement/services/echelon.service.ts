import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Echelon } from '../models/echelon';
import { SalaireBase } from '../models/salaire-base';

@Injectable({
  providedIn: 'root'
})
export class EchelonService {

  private _url:string = environment.hostmicroservicepaie+"echelon"

  constructor(private http: HttpClient) {

  }

  getEchelons(): Observable<Echelon[]> {
    return this.http.get<Echelon[]>(this._url+"/", environment.httpOptions)
  }

  getEchelon(id:number): Observable<Echelon> {
    return this.http.get<Echelon>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createEchelon(data:any):Observable<Echelon> {
    return this.http.post<Echelon>(this._url+"/", data, environment.httpOptions)
  }

  updateEchelon(id:number, data:any):Observable<Echelon> {
    return this.http.put<Echelon>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteEchelon(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

  /******************** */
  getSalaireBases(id:number):Observable<SalaireBase[]> {
    return this.http.get<SalaireBase[]>(`${this._url}/${id}/salaire-bases`, environment.httpOptions)
  }

}

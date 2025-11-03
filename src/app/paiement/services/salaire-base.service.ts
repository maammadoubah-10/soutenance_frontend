import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalaireBase } from '../models/salaire-base';

@Injectable({
  providedIn: 'root'
})
export class SalaireBaseService {

  private _url:string = environment.hostmicroservicepaie+"salaire/base"

  constructor(private http: HttpClient) {

  }

  getSalaireBases(): Observable<SalaireBase[]> {
    return this.http.get<SalaireBase[]>(this._url+"/", environment.httpOptions)
  }

  getSalaireBase(id:number): Observable<SalaireBase> {
    return this.http.get<SalaireBase>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createSalaireBase(data:any):Observable<SalaireBase> {
    return this.http.post<SalaireBase>(this._url+"/", data, environment.httpOptions)
  }

  updateSalaireBase(id:number, data:any):Observable<SalaireBase> {
    return this.http.put<SalaireBase>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteSalaireBase(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

}

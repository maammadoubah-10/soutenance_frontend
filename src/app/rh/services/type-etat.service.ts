import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeEtat } from '../models/type-etat';
import { Etat } from '../models/etat';

@Injectable({
  providedIn: 'root'
})
export class TypeEtatService {

  private _url:string = environment.hostmicroservicepaie+"type-etats"

  constructor(private http: HttpClient) {

  }

  getTypeEtats(): Observable<TypeEtat[]> {
    return this.http.get<TypeEtat[]>(this._url+"/", environment.httpOptions)
  }

  getTypeEtat(id:number): Observable<TypeEtat> {
    return this.http.get<TypeEtat>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createTypeEtat(data:any):Observable<TypeEtat> {
    return this.http.post<TypeEtat>(this._url+"/", data, environment.httpOptions)
  }

  updateTypeEtat(id:number, data:any):Observable<TypeEtat> {
    return this.http.patch<TypeEtat>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteTypeEtat(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

  /**********************/
  getEtats(id:number): Observable<Etat[]> {
    return this.http.get<Etat[]>(`${this._url}/${id}/etats`, environment.httpOptions)
  }


}

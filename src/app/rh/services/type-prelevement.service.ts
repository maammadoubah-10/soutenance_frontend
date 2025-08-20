import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypePrelevement } from '../models/type-prelevement';
import { Prelevement } from '../models/prelevement';

@Injectable({
  providedIn: 'root'
})
export class TypePrelevementService {

  private _url:string = environment.hostmicroservicepaie+"type-prelevements"

  constructor(private http: HttpClient) {

  }

  getTypePrelevements(): Observable<TypePrelevement[]> {
    return this.http.get<TypePrelevement[]>(this._url+"/", environment.httpOptions)
  }

  getTypePrelevement(id:number): Observable<TypePrelevement> {
    return this.http.get<TypePrelevement>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createTypePrelevement(data:any):Observable<TypePrelevement> {
    return this.http.post<TypePrelevement>(this._url+"/", data, environment.httpOptions)
  }

  updateTypePrelevement(id:number, data:any):Observable<TypePrelevement> {
    return this.http.patch<TypePrelevement>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteTypePrelevement(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

  /**********************/
  getPrelevements(id:number): Observable<Prelevement[]> {
    return this.http.get<Prelevement[]>(`${this._url}/${id}/prelevements`, environment.httpOptions)
  }

}

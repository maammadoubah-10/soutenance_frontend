import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeAutorisation } from '../models/type-autorisation';
import { Autorisation } from '../models/autorisation';

@Injectable({
  providedIn: 'root'
})
export class TypeAutorisationService {

  private _url:string = environment.hostmicroservicepaie+"type/autorisation"

  constructor(private http: HttpClient) {

  }

  getTypeAutorisations(): Observable<TypeAutorisation[]> {
    return this.http.get<TypeAutorisation[]>(this._url+"/", environment.httpOptions)
  }

  getTypeAutorisation(id:number): Observable<TypeAutorisation> {
    return this.http.get<TypeAutorisation>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createTypeAutorisation(data:any):Observable<TypeAutorisation> {
    return this.http.post<TypeAutorisation>(this._url+"/", data, environment.httpOptions)
  }

  updateTypeAutorisation(id:number, data:any):Observable<TypeAutorisation> {
    return this.http.put<TypeAutorisation>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteTypeAutorisation(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

  /**********************/
  getAutorisations(id:number): Observable<Autorisation[]> {
    return this.http.get<Autorisation[]>(`${this._url}/${id}/autorisations`, environment.httpOptions)
  }


}

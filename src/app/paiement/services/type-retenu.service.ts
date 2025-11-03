import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeRetenu } from '../models/type-retenu';
import { Retenu } from '../models/retenu';

@Injectable({
  providedIn: 'root'
})
export class TypeRetenuService {

  private _url:string = environment.hostmicroservicepaie+"type/retenu"

  constructor(private http: HttpClient) {

  }

  getTypeRetenus(): Observable<TypeRetenu[]> {
    return this.http.get<TypeRetenu[]>(this._url+"/", environment.httpOptions)
  }

  getTypeRetenu(id:number): Observable<TypeRetenu> {
    return this.http.get<TypeRetenu>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createTypeRetenu(data:any):Observable<TypeRetenu> {
    return this.http.post<TypeRetenu>(this._url+"/", data, environment.httpOptions)
  }

  updateTypeRetenu(id:number, data:any):Observable<TypeRetenu> {
    return this.http.put<TypeRetenu>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteTypeRetenu(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

  /**********************/
  getRetenus(id:number): Observable<Retenu[]> {
    return this.http.get<Retenu[]>(`${this._url}/${id}/retenus`, environment.httpOptions)
  }

}

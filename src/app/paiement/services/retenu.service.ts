import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Retenu } from '../models/retenu';

@Injectable({
  providedIn: 'root'
})
export class RetenuService {

  private _url:string = environment.hostmicroservicepaie+"retenu"

  constructor(private http: HttpClient) {

  }

  getRetenus(): Observable<Retenu[]> {
    return this.http.get<Retenu[]>(this._url+"/", environment.httpOptions)
  }

  getRetenu(id:number): Observable<Retenu> {
    return this.http.get<Retenu>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createRetenu(data:any):Observable<Retenu> {
    return this.http.post<Retenu>(this._url+"/", data, environment.httpOptions)
  }

  updateRetenu(id:number, data:any):Observable<Retenu> {
    return this.http.put<Retenu>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteRetenu(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

}

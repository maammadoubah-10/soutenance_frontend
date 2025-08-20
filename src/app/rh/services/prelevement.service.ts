import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prelevement } from '../models/prelevement';

@Injectable({
  providedIn: 'root'
})
export class PrelevementService {

  private _url:string = environment.hostmicroservicepaie+"prelevement-fixes"

  constructor(private http: HttpClient) {

  }

  getPrelevements(): Observable<Prelevement[]> {
    return this.http.get<Prelevement[]>(this._url+"/", environment.httpOptions)
  }

  getPrelevement(id:number): Observable<Prelevement> {
    return this.http.get<Prelevement>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createPrelevement(data:any):Observable<Prelevement> {
    return this.http.post<Prelevement>(this._url+"/", data, environment.httpOptions)
  }

  updatePrelevement(id:number, data:any):Observable<Prelevement> {
    return this.http.patch<Prelevement>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deletePrelevement(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

}

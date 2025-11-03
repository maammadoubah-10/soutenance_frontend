import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banque } from '../models/banque';

@Injectable({
  providedIn: 'root'
})
export class BanqueService {

  private _url:string = environment.hostmicroservicepaie+"banque"

  constructor(private http: HttpClient) {

  }

  getBanques(): Observable<Banque[]> {
    return this.http.get<Banque[]>(this._url+"/", environment.httpOptions)
  }

  getBanque(id:number): Observable<Banque> {
    return this.http.get<Banque>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createBanque(data:any):Observable<Banque> {
    return this.http.post<Banque>(this._url+"/", data, environment.httpOptions)
  }

  updateBanque(id:number, data:any):Observable<Banque> {
    return this.http.patch<Banque>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteBanque(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

}

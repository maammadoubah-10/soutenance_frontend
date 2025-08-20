import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banques } from '../models/banques';

@Injectable({
  providedIn: 'root'
})
export class BanqueService {

  private _url:string = environment.hostmicroservicepaie+"banque"

  constructor(private http: HttpClient) {

  }

  getBanques(): Observable<Banques[]> {
    return this.http.get<Banques[]>(this._url+"/", environment.httpOptions)
  }

  getBanque(id:number): Observable<Banques> {
    return this.http.get<Banques>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createBanque(data:any):Observable<Banques> {
    return this.http.post<Banques>(this._url+"/", data, environment.httpOptions)
  }

  updateBanque(id:number, data:any):Observable<Banques> {
    return this.http.patch<Banques>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteBanque(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

}

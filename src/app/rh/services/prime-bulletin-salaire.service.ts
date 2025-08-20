import { Injectable } from '@angular/core';
import { PrimeBulletinSalaire } from '../models/prime-bulletin-salaire';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrimeBulletinSalaireService {

  private _url:string = environment.hostmicroservicepaie+"prime-bulletin-salaire"

  constructor(private http: HttpClient) {

  }

  getPrimeBulletinSalaires(): Observable<PrimeBulletinSalaire[]> {
    return this.http.get<PrimeBulletinSalaire[]>(this._url+"/", environment.httpOptions)
  }

  getPrimeBulletinSalaire(id:number): Observable<PrimeBulletinSalaire> {
    return this.http.get<PrimeBulletinSalaire>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createPrimeBulletinSalaire(data:any):Observable<PrimeBulletinSalaire> {
    return this.http.post<PrimeBulletinSalaire>(this._url+"/", data, environment.httpOptions)
  }

  updatePrimeBulletinSalaire(id:number, data:any):Observable<PrimeBulletinSalaire> {
    return this.http.patch<PrimeBulletinSalaire>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deletePrimeBulletinSalaire(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }
}

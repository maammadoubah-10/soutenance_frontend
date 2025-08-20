import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalaireBaseBulletinSalaire } from '../models/salaire-base-bulletin-salaire';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SalaireBaseBulletinSalaireService {

  private _url:string = environment.hostmicroservicepaie+"salaire-base-bulletin-salaire"

  constructor(private http: HttpClient) {

  }

  getSalaireBaseBulletinSalaires(): Observable<SalaireBaseBulletinSalaire[]> {
    return this.http.get<SalaireBaseBulletinSalaire[]>(this._url+"/", environment.httpOptions)
  }

  getSalaireBaseBulletinSalaire(id:number): Observable<SalaireBaseBulletinSalaire> {
    return this.http.get<SalaireBaseBulletinSalaire>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createSalaireBaseBulletinSalaire(data:any):Observable<SalaireBaseBulletinSalaire> {
    return this.http.post<SalaireBaseBulletinSalaire>(this._url+"/", data, environment.httpOptions)
  }

  updateSalaireBaseBulletinSalaire(id:number, data:any):Observable<SalaireBaseBulletinSalaire> {
    return this.http.patch<SalaireBaseBulletinSalaire>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteSalaireBaseBulletinSalaire(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

}

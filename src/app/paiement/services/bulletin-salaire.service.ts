import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BulletinSalaire } from '../models/bulletin-salaire';

@Injectable({
  providedIn: 'root'
})
export class BulletinSalaireService {

  private _url:string = environment.hostmicroservicepaie+"bulletin/salaire"

  constructor(private http: HttpClient) {

  }

  getBulletinSalairesBySearch(search : string): Observable<BulletinSalaire[]> {
    return this.http.get<BulletinSalaire[]>(this._url+"/rechercher/" + search, environment.httpOptions)
  }

  getBulletinSalaires(): Observable<BulletinSalaire[]> {
    return this.http.get<BulletinSalaire[]>(this._url+"/", environment.httpOptions)
  }

  getBulletinSalaire(id:number): Observable<BulletinSalaire> {
    return this.http.get<BulletinSalaire>(this._url + "/" + id, environment.httpOptions)
  }

  creeBulletinSalaire(bulletinSalaireDto:any){
    return this.http.post<BulletinSalaire>(this._url, bulletinSalaireDto ,environment.httpOptions)
  }
  createBulletinSalaire(data:any):Observable<BulletinSalaire> {
    return this.http.post<BulletinSalaire>(this._url+"/", data, environment.httpOptions)
  }

  updateBulletinSalaire(id:number, data:any):Observable<BulletinSalaire> {
    return this.http.put<BulletinSalaire>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteBulletinSalaire(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }
  getAnneesMois():Observable<any>{
    return this.http.get<any>(this._url + "/annee/mois" , environment.httpOptions)
  }
  getBulletinsSalaireParAnneeMois(annee: string, mois: string):Observable<BulletinSalaire[]>{
    let params = new HttpParams();
    params = params.append('annee', annee)
    params = params.append('mois', mois)
    return this.http.get<BulletinSalaire[]>(this._url + "/mois/annee/", { params })
  }
}

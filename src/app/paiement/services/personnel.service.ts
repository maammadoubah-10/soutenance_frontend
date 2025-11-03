import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personnel } from '../models/personnel';
import { Retenu } from '../models/retenu';
import { Autorisation } from '../models/autorisation';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {

  private _url:string = environment.hostmicroservicepaie+"personnel"
  private _urlRh:string = environment.hostmicroservicepersonnel+"personnels"

  constructor(private http: HttpClient) {
  }

  getPersonnels(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(this._urlRh+"/", environment.httpOptions)
  }

  getPersonnelsFiltrer(search?: string): Observable<Personnel[]> {
    let params = new HttpParams();
    params = params.append('search', search ? search : "")
    return this.http.get<Personnel[]>(this._url+"/filtrer", {params})
  }

  getPersonnelsMoisAnnee(mois?: string, annee?: string, search?: string): Observable<Personnel[]> {
    let params = new HttpParams();
    params = params.append('mois', mois ? mois : "")
    params = params.append('annee', annee ? annee : "")
    params = params.append('search', search ? search : "")
    return this.http.get<Personnel[]>(this._url+"/bulletin/salaire/mois/annee", {params})
  }

  getPersonnel(id:number): Observable<Personnel> {
    return this.http.get<Personnel>(this._url +'/'+ id , environment.httpOptions)
  }

  createPersonnel(data:any):Observable<Personnel> {
    return this.http.post<Personnel>(this._url+"/", data, environment.httpOptions)
  }

  updatePersonnel(id:number, data:any):Observable<Personnel> {
    return this.http.patch<Personnel>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deletePersonnel(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

  /**********************/
  getRetenus(id:number): Observable<Retenu[]> {
    return this.http.get<Retenu[]>(`${this._url}/${id}/retenus`, environment.httpOptions)
  }

  getAutorisations(id:number): Observable<Autorisation[]> {
    return this.http.get<Autorisation[]>(`${this._url}/${id}/autorisations`, environment.httpOptions)
  }


}

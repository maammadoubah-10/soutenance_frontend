import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BulletinSalaire } from '../models/bulletin-salaire';
import {Avancement} from "../models/avancement";

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

  creeBulletinSalaire(bulletinSalaireDto){
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

  /***************** */
  public listerBulletinSalairePage(page: number, size: number, sort: string): Observable<BulletinSalaire> {
    const url = `${this._url}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<BulletinSalaire>(url, { observe: 'response' });
  }

  public rechercheBulletinSalaire(search: string): Observable<BulletinSalaire> {
    const url = `${this._url}/filtrer?search=${search}`;
    // @ts-ignore
    return this.http.get<BulletinSalaire>(url, { observe: 'response' });
  }

  public creerBulletinSalaire(data: any): Observable<BulletinSalaire> {
    return this.http.post<BulletinSalaire>(
      this._url,
      data
    );
  }

  public modifierBulletinSalaire(id:any, data:any):Observable<BulletinSalaire>{
    return this.http.patch<BulletinSalaire>(
      this._url +"/get-bulletin/"+id,data)
  }

  public supprimerBulletinSalaire(id: number) {
    return this.http.delete<any>(this._url + "/" + id);
  }

  public voirBulletinSalaire(id:number,){
    return this.http.get<any>(
      this._url+ '/'+id
    )}

  public recupererBulletinSalaireParMoisAnnee(annee: string, mois: string): Observable<BulletinSalaire> {
    const url = `${this._url}/mois/annee?mois=${mois}&annee=${annee}`;
    // @ts-ignore
    return this.http.get<BulletinSalaire>(url, { observe: 'response' });
  }

  public listePrimesBulletin(personnelID:number): Observable<any> {
    const url = `${this._url}/get-bulletin/` + personnelID;
    // @ts-ignore
    return this.http.get<any>(url, { observe: 'response' });
  }
}

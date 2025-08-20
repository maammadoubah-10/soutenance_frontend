import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeAutorisation } from '../models/type-autorisation';
import { Autorisation } from '../models/autorisation';
import {TypeRetenu} from "../models/type-retenu";

@Injectable({
  providedIn: 'root'
})
export class TypeAutorisationService {

  private _url:string = environment.hostmicroservicepaie+"type/autorisation"

  constructor(private http: HttpClient) {

  }

  getTypeAutorisations(): Observable<TypeAutorisation[]> {
    return this.http.get<TypeAutorisation[]>(this._url+"/", environment.httpOptions)
  }

  getTypeAutorisation(id:number): Observable<TypeAutorisation> {
    return this.http.get<TypeAutorisation>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createTypeAutorisation(data:any):Observable<TypeAutorisation> {
    return this.http.post<TypeAutorisation>(this._url+"/", data, environment.httpOptions)
  }

  updateTypeAutorisation(id:number, data:any):Observable<TypeAutorisation> {
    return this.http.put<TypeAutorisation>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteTypeAutorisation(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

  /**********************/
  getAutorisations(id:number): Observable<Autorisation[]> {
    return this.http.get<Autorisation[]>(`${this._url}/${id}/autorisations`, environment.httpOptions)
  }

  /************ */
  public listerTypeAutorisationPage(page: number, size: number, sort: string): Observable<TypeAutorisation> {
    const url = `${this._url}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<TypeAutorisation>(url, { observe: 'response' });
  }

  public rechercheTypeAutorisation(search: string): Observable<TypeAutorisation> {
    const url = `${this._url}/filtrer?search=${search}`;
    // @ts-ignore
    return this.http.get<TypeAutorisation>(url, { observe: 'response' });
  }

  public creerTypeAutorisation(data: any): Observable<TypeAutorisation> {
    return this.http.post<TypeAutorisation>(
      this._url,
      data
    );
  }

  public modifierTypeAutorisation(id:any, data:any):Observable<TypeAutorisation>{
    return this.http.put<TypeAutorisation>(
      this._url +"/"+id,data)
  }

  public supprimerTypeAutorisation(id: number) {
    return this.http.delete<any>(this._url + "/" + id);
  }

  public voirTypeAutorisation(id:number,){
    return this.http.get<any>(
      this._url+ '/'+id
    )}

}

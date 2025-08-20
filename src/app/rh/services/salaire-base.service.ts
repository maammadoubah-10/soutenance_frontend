import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalaireBase } from '../models/salaire-base';
import {ImpactSalarial} from "../models/impact-salarial";

@Injectable({
  providedIn: 'root'
})
export class SalaireBaseService {

  private _url:string = environment.hostmicroservicepaie+"salaire/base"

  constructor(private http: HttpClient) {

  }

  getSalaireBases(): Observable<SalaireBase[]> {
    return this.http.get<SalaireBase[]>(this._url+"/", environment.httpOptions)
  }

  getSalaireBase(id:number): Observable<SalaireBase> {
    return this.http.get<SalaireBase>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createSalaireBase(data:any):Observable<SalaireBase> {
    return this.http.post<SalaireBase>(this._url+"/", data, environment.httpOptions)
  }

  updateSalaireBase(id:number, data:any):Observable<SalaireBase> {
    return this.http.put<SalaireBase>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteSalaireBase(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

  /***************** */
  public listerSalaireBasePage(page: number, size: number, sort: string): Observable<SalaireBase> {
    const url = `${this._url}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<SalaireBase>(url, { observe: 'response' });
  }

  public rechercheSalaireBase(search: string): Observable<SalaireBase> {
    const url = `${this._url}/filtrer?search=${search}`;
    // @ts-ignore
    return this.http.get<SalaireBase>(url, { observe: 'response' });
  }

  public creerSalaireBase(data: any): Observable<SalaireBase> {
    return this.http.post<SalaireBase>(
      this._url,
      data
    );
  }

  public modifierSalaireBase(id:any, data:any):Observable<SalaireBase>{
    return this.http.put<SalaireBase>(
      this._url +"/"+id,data)
  }

  public supprimerSalaireBase(id: number) {
    return this.http.delete<any>(this._url + "/" + id);
  }

  public voirSalaireBase(id:number,){
    return this.http.get<any>(
      this._url+ '/'+id
    )}
}

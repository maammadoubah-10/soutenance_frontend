import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Autorisation } from '../models/autorisation';

@Injectable({
  providedIn: 'root'
})
export class AutorisationService {

  private _url:string = environment.hostmicroservicepaie+"autorisation"

  constructor(private http: HttpClient) {

  }

  getAutorisations(): Observable<Autorisation[]> {
    return this.http.get<Autorisation[]>(this._url+"/", environment.httpOptions)
  }

  getAutorisation(id:number): Observable<Autorisation> {
    return this.http.get<Autorisation>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createAutorisation(data:any):Observable<Autorisation> {
    return this.http.post<Autorisation>(this._url+"/", data, environment.httpOptions)
  }

  updateAutorisation(id:number, data:any):Observable<Autorisation> {
    return this.http.put<Autorisation>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteAutorisation(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

  /***************** */
  public listerAutorisationPage(page: number, size: number, sort: string): Observable<Autorisation> {
    const url = `${this._url}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Autorisation>(url, { observe: 'response' });
  }

  public rechercheAutorisation(search: string): Observable<Autorisation> {
    const url = `${this._url}/filtrer?search=${search}`;
    // @ts-ignore
    return this.http.get<Autorisation>(url, { observe: 'response' });
  }

  public creerAutorisation(data: any): Observable<Autorisation> {
    return this.http.post<Autorisation>(
      this._url,
      data
    );
  }

  public modifierAutorisation(id:any, data:any):Observable<Autorisation>{
    return this.http.put<Autorisation>(
      this._url +"/"+id,data)
  }

  public supprimerAutorisation(id: number) {
    return this.http.delete<any>(this._url + "/" + id);
  }

  public voirAutorisation(id:number,){
    return this.http.get<any>(
      this._url+ '/'+id
    )}
}

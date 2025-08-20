import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Echelon } from '../models/echelon';
import { SalaireBase } from '../models/salaire-base';

@Injectable({
  providedIn: 'root'
})
export class EchelonService {

  private _url:string = environment.hostmicroservicepersonnel+"echelons"

  constructor(private http: HttpClient) {

  }

  /******************** */
  getSalaireBases(id:number):Observable<SalaireBase[]> {
    return this.http.get<SalaireBase[]>(`${this._url}/${id}/salaire-bases`, environment.httpOptions)
  }

  /****************** */
  public listerEchelonPage(page: number, size: number, sort: string): Observable<Echelon> {
    const url = `${this._url}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Echelon>(url, { observe: 'response' });
  }

  public rechercheEchelon(search: string): Observable<Echelon> {
    const url = `${this._url}/filtrer?search=${search}`;
    // @ts-ignore
    return this.http.get<Echelon>(url, { observe: 'response' });
  }

  public creerEchelon(data: any): Observable<Echelon> {
    return this.http.post<Echelon>(
      this._url,
      data
    );
  }

  public modifierEchelon(id:any, data:any):Observable<Echelon>{
    return this.http.patch<Echelon>(
      this._url +"/"+id,data)
  }

  public supprimerEchelon(id: number) {
    return this.http.delete<any>(this._url + "/" + id);
  }

  public voirEchelon(id:number,){
    return this.http.get<any>(
      this._url+ '/'+id
    )}

  public listerSalaireEchelon(id: number, page: number, size: number): Observable<Echelon> {
    const url = `${this._url}/${id}/salaires?page=${page}&size=${size}`;
    // @ts-ignore
    return this.http.get<Echelon>(url, { observe: 'response' });
  }

  listeEchelonPats(): Observable<any> {
    const unite = "PATS"; // Valeur à utiliser pour l'unité PATS
    const url = `${this._url}/unite/${unite}`;
    return this.http.get<any>(url, {observe: 'response'});
  }

  listeEchelonEnseignant(): Observable<any> {
    const unite = "ENSEIGNANT"; // Valeur à utiliser pour l'unité PATS
    const url = `${this._url}/unite/${unite}`;
    return this.http.get<any>(url, {observe: 'response'});
  }

}

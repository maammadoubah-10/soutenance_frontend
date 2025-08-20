import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';
import { HttpClient } from '@angular/common/http';
import { SalaireBase } from '../models/salaire-base';
import {Echelon} from "../models/echelon";
import {Poste} from "../models/poste";

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private _url:string = environment.hostmicroservicepersonnel+"categories"

  constructor(private http: HttpClient) {

  }

  /****************** */
  getSalaireBases(id:number):Observable<SalaireBase[]> {
    return this.http.get<SalaireBase[]>(`${this._url}/${id}/salaire-bases`, environment.httpOptions)
  }


  /************ */
  public listerCategoriePage(page: number, size: number, sort: string): Observable<Category> {
    const url = `${this._url}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Category>(url, { observe: 'response' });
  }

  public rechercheCategorie(search: string): Observable<Category> {
    const url = `${this._url}/filtrer?search=${search}`;
    // @ts-ignore
    return this.http.get<Category>(url, { observe: 'response' });
  }

  public creerCategorie(data: any): Observable<Category> {
    return this.http.post<Category>(
      this._url,
      data
    );
  }

  public modifierCategorie(id:any, data:any):Observable<Category>{
    return this.http.patch<Category>(
      this._url +"/"+id,data)
  }

  public supprimerCategorie(id: number) {
    return this.http.delete<any>(this._url + "/" + id);
  }

  public voirCategorie(id:number,){
    return this.http.get<any>(
      this._url+ '/'+id
    )}

  public listerSalaireCategorie(id: number, page: number, size: number): Observable<Category> {
    const url = `${this._url}/${id}/salaires?page=${page}&size=${size}`;
    // @ts-ignore
    return this.http.get<Category>(url, { observe: 'response' });
  }

  listeCategoriePats(): Observable<any> {
    const unite = "PATS"; // Valeur à utiliser pour l'unité PATS
    const url = `${this._url}/unite/${unite}`;
    return this.http.get<any>(url, {observe: 'response'});
  }

  listeCategorieEnseignant(): Observable<any> {
    const unite = "ENSEIGNANT"; // Valeur à utiliser pour l'unité PATS
    const url = `${this._url}/unite/${unite}`;
    return this.http.get<any>(url, {observe: 'response'});
  }
}

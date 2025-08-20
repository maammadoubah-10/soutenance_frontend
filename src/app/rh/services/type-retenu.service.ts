import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeRetenu } from '../models/type-retenu';
import { Retenu } from '../models/retenu';

@Injectable({
  providedIn: 'root'
})
export class TypeRetenuService {

  private _url:string = environment.hostmicroservicepaie+"type/retenu"

  constructor(private http: HttpClient) {

  }

  /********************* */
  getRetenus(id:number): Observable<Retenu[]> {
    return this.http.get<Retenu[]>(`${this._url}/${id}/retenus`, environment.httpOptions)
  }

  /************ */
  public listerTypeRetenuPage(page: number, size: number, sort: string): Observable<TypeRetenu> {
    const url = `${this._url}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<TypeRetenu>(url, { observe: 'response' });
  }

  public rechercheTypeRetenu(search: string): Observable<TypeRetenu> {
    const url = `${this._url}/filtrer?search=${search}`;
    // @ts-ignore
    return this.http.get<TypeRetenu>(url, { observe: 'response' });
  }

  public creerTypeRetenu(data: any): Observable<TypeRetenu> {
    return this.http.post<TypeRetenu>(
      this._url,
      data
    );
  }

  public modifierTypeRetenu(id:any, data:any):Observable<TypeRetenu>{
    return this.http.put<TypeRetenu>(
      this._url +"/"+id,data)
  }

  public supprimerTypeRetenu(id: number) {
    return this.http.delete<any>(this._url + "/" + id);
  }

  public voirTypeRetenu(id:number,){
    return this.http.get<any>(
      this._url+ '/'+id
    )}
}

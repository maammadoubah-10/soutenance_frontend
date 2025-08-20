import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TypeImpactSalarial } from '../models/type-impact-salarial';

@Injectable({
  providedIn: 'root'
})
export class TypeImpactSalarialService {

  private _url:string = environment.hostmicroservicepaie+"type/impact/salarial"

  constructor(private http: HttpClient) { }

  /************ */
  public listerTypeImpactSalarialPage(page: number, size: number, sort: string): Observable<TypeImpactSalarial> {
    const url = `${this._url}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<TypeImpactSalarial>(url, { observe: 'response' });
  }

  public rechercheTypeImpactSalarial(search: string): Observable<TypeImpactSalarial> {
    const url = `${this._url}/filtrer?search=${search}`;
    // @ts-ignore
    return this.http.get<TypeImpactSalarial>(url, { observe: 'response' });
  }

  public creerTypeImpactSalarial(data: any): Observable<TypeImpactSalarial> {
    return this.http.post<TypeImpactSalarial>(
      this._url,
      data
    );
  }

  public modifierTypeImpactSalarial(id:any, data:any):Observable<TypeImpactSalarial>{
    return this.http.put<TypeImpactSalarial>(
      this._url +"/"+id,data)
  }

  public supprimerTypeImpactSalarial(id: number) {
    return this.http.delete<any>(this._url + "/" + id);
  }

  public voirTypeImpactSalarial(id:number,){
    return this.http.get<any>(
      this._url+ '/'+id
    )}

}

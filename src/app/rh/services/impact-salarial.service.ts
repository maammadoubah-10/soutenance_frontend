import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ImpactSalarial } from '../models/impact-salarial'

@Injectable({
  providedIn: 'root'
})
export class ImpactSalarialService {

  private _url:string = environment.hostmicroservicepaie+"impact/salarial"

  constructor(private http: HttpClient) { }

  updateimpactSalarial(id: number, data: any):Observable<ImpactSalarial>  {
    return this.http.put<ImpactSalarial>(this._url+"/"+id, data, environment.httpOptions)
  }
  deleteimpactSalarial(id: number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }
  createimpactSalarialervice(data: any):Observable<ImpactSalarial> {
    return this.http.post<ImpactSalarial>(this._url+"/", data, environment.httpOptions)
  }
  getimpactSalarial(page: number, size: number):Observable<any[]> {
    let params = new HttpParams();
    params = params.append('page', page)
    params = params.append('size', size)
    return this.http.get<any[]>(this._url+"/", {params})
  }

  /***************** */
  public listerImpactSalarialPage(page: number, size: number, sort: string): Observable<ImpactSalarial> {
    const url = `${this._url}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<ImpactSalarial>(url, { observe: 'response' });
  }

  public rechercheImpactSalarial(search: string): Observable<ImpactSalarial> {
    const url = `${this._url}/filtrer?search=${search}`;
    // @ts-ignore
    return this.http.get<ImpactSalarial>(url, { observe: 'response' });
  }

  public creerImpactSalarial(data: any): Observable<ImpactSalarial> {
    return this.http.post<ImpactSalarial>(
      this._url,
      data
    );
  }

  public modifierImpactSalarial(id:any, data:any):Observable<ImpactSalarial>{
    return this.http.put<ImpactSalarial>(
      this._url +"/"+id,data)
  }

  public supprimerImpactSalarial(id: number) {
    return this.http.delete<any>(this._url + "/" + id);
  }

  public voirImpactSalarial(id:number,){
    return this.http.get<any>(
      this._url+ '/'+id
    )}
}

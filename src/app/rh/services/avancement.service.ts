import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avancement } from '../models/avancement';

@Injectable({
  providedIn: 'root'
})
export class AvancementService {

  private _url:string = environment.hostmicroservicepaie+"avancement"

  constructor(private http: HttpClient) {

  }

  getAvancements(page: number, size: number): Observable<Avancement[]> {
    let params = new HttpParams();
    params = params.append('page', page)
    params = params.append('size', size)
    return this.http.get<Avancement[]>(this._url+"/", {params} )
  }

  getAvancement(id:number): Observable<Avancement> {
    return this.http.get<Avancement>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createAvancement(data:any):Observable<Avancement> {
    return this.http.post<Avancement>(this._url+"/", data, environment.httpOptions)
  }

  updateAvancement(id:number, data:any):Observable<Avancement> {
    return this.http.put<Avancement>(this._url+"/"+id, data, environment.httpOptions)
  }

  deleteAvancement(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

  /***************** */
  public listerAvancementPage(page: number, size: number, sort: string): Observable<Avancement> {
    const url = `${this._url}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<Avancement>(url, { observe: 'response' });
  }

  public rechercheAvancement(search: string): Observable<Avancement> {
    const url = `${this._url}/filtrer?search=${search}`;
    // @ts-ignore
    return this.http.get<Avancement>(url, { observe: 'response' });
  }

  public creerAvancement(data: any): Observable<Avancement> {
    return this.http.patch<Avancement>(
      this._url,
      data
    );
  }

  public modifierAvancement(id:any, data:any):Observable<Avancement>{
    return this.http.put<Avancement>(
      this._url +"/"+id,data)
  }

  public supprimerAvancement(id: number) {
    return this.http.delete<any>(this._url + "/" + id);
  }

  public voirAvancement(id:number,){
    return this.http.get<any>(
      this._url+ '/'+id
    )}

}

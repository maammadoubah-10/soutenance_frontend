import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImpactSalarial } from '../models/impact-salarial';
import { environment } from '../../../environments/environment';

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
    return this.http.get<any[]>(this._url, {params})
  }

}

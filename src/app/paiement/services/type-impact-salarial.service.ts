import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TypeImpactSalarial } from '../models/type-impact-salarial';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeImpactSalarialService {

  private _url:string = environment.hostmicroservicepaie+"type/impact/salarial"

  constructor(private http: HttpClient) { }

  gettypeImpactSalarial(page: number, size: number):Observable<any> {
    let params = new HttpParams();
    params = params.append('page', page)
    params = params.append('size', size)
    return this.http.get<any>(this._url, {params})
  }

  getToutTypeImpactSalarial(search?: string):Observable<TypeImpactSalarial[]>{
    let params = new HttpParams();
    params = params.append('search', search ? search : "")
    return this.http.get<TypeImpactSalarial[]>(this._url+"/filtrer", {params})
  }
  createTypeImpactSalarial(data : any):Observable<TypeImpactSalarial> {
    return this.http.post<TypeImpactSalarial>(this._url+"/", data, environment.httpOptions)
  }
  updateTypeImpactSalarial(id : number, data : any) {
    return this.http.put<TypeImpactSalarial>(this._url+"/"+id, data, environment.httpOptions)
  }
  deleteTypeImpactSalarial(id : number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

}

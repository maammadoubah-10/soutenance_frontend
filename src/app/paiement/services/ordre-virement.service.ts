import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdreVirement } from '../models/ordre-virement';

@Injectable({
  providedIn: 'root'
})
export class OrdreVirementService {

  private _url:string = environment.hostmicroservicepaie+"ordre/virement"


  constructor(private http: HttpClient) { }

  createOrdreVirement(data: any):Observable<OrdreVirement> {
    return this.http.post<OrdreVirement>(this._url, data, environment.httpOptions)
  }
  updateOrdreVirement(id: number, data: any):Observable<OrdreVirement>  {
    return this.http.put<OrdreVirement>(this._url+"/"+id, data, environment.httpOptions)
  }
  deleteOrdreVirement(id: number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }
  getOrdreVirements():Observable<OrdreVirement[]> {
    return this.http.get<OrdreVirement[]>(this._url, environment.httpOptions)
  }
  getOrdreVirement(id : number):Observable<OrdreVirement> {
    return this.http.get<OrdreVirement>(this._url +'/'+ id, environment.httpOptions)
  }

}

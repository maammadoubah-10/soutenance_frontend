import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Poste } from '../models/poste';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PosteService {

  private _url:string = environment.hostmicroservicepaie+"poste"

  constructor(private http: HttpClient) {
  }

  getPostes(): Observable<Poste[]> {
    return this.http.get<Poste[]>(this._url+"/", environment.httpOptions)
  }

  getToutPostes(search?: string):Observable<Poste[]> {
    let params = new HttpParams();
    params = params.append('search', search ? search : "")
    return this.http.get<Poste[]>(this._url+"/filtrer", {params})
  }

}

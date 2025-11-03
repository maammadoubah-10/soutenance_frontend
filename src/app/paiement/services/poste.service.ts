import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Poste } from '../models/poste';

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

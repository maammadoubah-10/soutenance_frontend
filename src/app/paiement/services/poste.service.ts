import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Poste } from '../models/poste';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PosteService {

  private _url:string = environment.hostmicroservicepersonnel+"postes"

  constructor(private http: HttpClient) {
  }

  getPostes(): Observable<Poste[]> {
    return this.http.get<Poste[]>(this._url+"/", environment.httpOptions)
  }

  getToutPostes(search?: string):Observable<Poste[]> {
  
    return this.http.get<Poste[]>(this._url+"/listes", environment.httpOptions)
  }

}

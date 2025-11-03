import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private _url:string = environment.hostmicroservicepaie+"services"

  constructor(private http: HttpClient) {

  }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this._url+"/", environment.httpOptions)
  }
}

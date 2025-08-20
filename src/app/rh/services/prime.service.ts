import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prime } from '../models/prime';

@Injectable({
  providedIn: 'root'
})
export class PrimeService {

  private _url:string = environment.hostmicroservicepaie+"primes"

  constructor(private http: HttpClient) {

  }

  getPrimes(): Observable<Prime[]> {
    return this.http.get<Prime[]>(this._url+"/", environment.httpOptions)
  }

  getPrime(id:number): Observable<Prime> {
    return this.http.get<Prime>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createPrime(data:any):Observable<Prime> {
    return this.http.post<Prime>(this._url+"/", data, environment.httpOptions)
  }

  updatePrime(id:number, data:any):Observable<Prime> {
    return this.http.patch<Prime>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deletePrime(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }
}

import { Injectable } from '@angular/core';
import { TypePrime } from '../models/type-prime';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Prime } from '../models/prime';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypePrimeService {

  private _url:string = environment.hostmicroservicepaie+"type-primes"

  constructor(private http: HttpClient) {

  }

  getTypePrimes(): Observable<TypePrime[]> {
    return this.http.get<TypePrime[]>(this._url+"/", environment.httpOptions)
  }

  getTypePrime(id:number): Observable<TypePrime> {
    return this.http.get<TypePrime>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createTypePrime(data:any):Observable<TypePrime> {
    return this.http.post<TypePrime>(this._url+"/", data, environment.httpOptions)
  }

  updateTypePrime(id:number, data:any):Observable<TypePrime> {
    return this.http.patch<TypePrime>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteTypePrime(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

  /**********************/
  getPrimes(id:number): Observable<Prime[]> {
    return this.http.get<Prime[]>(`${this._url}/${id}/primes`, environment.httpOptions)
  }



}

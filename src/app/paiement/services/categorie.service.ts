import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { HttpClient } from '@angular/common/http';
import { SalaireBase } from '../models/salaire-base';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private _url:string = environment.hostmicroservicepaie+"categorie"

  constructor(private http: HttpClient) {

  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this._url+"/", environment.httpOptions)
  }

  getCategory(id:number): Observable<Category> {
    return this.http.get<Category>(`${this._url}?id=${id}`, environment.httpOptions)
  }

  createCategory(data:any):Observable<Category> {
    return this.http.post<Category>(this._url+"/", data, environment.httpOptions)
  }

  updateCategory(id:number, data:any):Observable<Category> {
    return this.http.put<Category>(`${this._url}/${id}`, data, environment.httpOptions)
  }

  deleteCategory(id:number) {
    return this.http.delete(`${this._url}/${id}`, environment.httpOptions)
  }

  /****************** */
  getSalaireBases(id:number):Observable<SalaireBase[]> {
    return this.http.get<SalaireBase[]>(`${this._url}/${id}/salaire-bases`, environment.httpOptions)
  }

}

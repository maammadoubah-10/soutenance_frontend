import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Service} from "../models/service";
import {Poste} from "../models/poste";

@Injectable({
  providedIn: 'root'
})
export class PosteService {

  public contextPath: string = environment.hostmicroservicepersonnel + "postes";

  constructor(private httpClient: HttpClient) {}

  public listerPostePage(page: number, size: number, sort: string): Observable<Poste> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Poste>(url, { observe: 'response' });
  }

  public listerPosteNoPage(): Observable<Poste> {
    const url = `${this.contextPath+ '/listes'}`;
    // @ts-ignore
    return this.httpClient.get<Poste>(url, { observe: 'response' });
  }

  public recherchePoste(designation: string): Observable<Poste> {
    const url = `${this.contextPath}?designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<Poste>(url, { observe: 'response' });
  }

  public voirPoste(id:number){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id
    )}

  public recherchePostePage(designation: string, page: number, size: number, sort: string): Observable<Poste> {
    const url = `${this.contextPath}?designation=${designation}&page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Poste>(url, { observe: 'response' });
  }

  public creerPoste(data: any): Observable<Poste> {
    return this.httpClient.post<Poste>(
      this.contextPath,
      data
    );
  }

  public modifierPoste(id:any, data:any):Observable<Poste>{
    return this.httpClient.patch<Poste>(
      this.contextPath +"/"+id,data)
  }

  public supprimerPoste(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  //Paie liens


  private _url:string = environment.hostmicroservicepaie+"poste"


  getPostes(): Observable<Poste[]> {
    return this.httpClient.get<Poste[]>(this._url+"/", environment.httpOptions)
  }

  getToutPostes(search?: string):Observable<Poste[]> {
    let params = new HttpParams();
    params = params.append('search', search ? search : "")
    return this.httpClient.get<Poste[]>(this._url+"/filtrer", {params})
  }


}

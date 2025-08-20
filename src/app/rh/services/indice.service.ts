import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Indice} from "../models/indice";

@Injectable({
  providedIn: 'root'
})
export class IndiceService {

  public contextPath: string = environment.hostmicroservicepersonnel + "indices";

  constructor(private httpClient: HttpClient) {}

  public listerIndicePage(page: number, size: number, sort: string): Observable<Indice> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Indices>(url, { observe: 'response' });
  }

  public rechercheIndicePage(sort: string, designation: string): Observable<Indice> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<Indices>(url, { observe: 'response' });
  }

  public rechercheIndice(nom: string): Observable<any> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public creerIndice(data: any): Observable<Indice> {
    return this.httpClient.post<Indice>(
      this.contextPath,
      data
    );
  }



  public modifierIndice(id:any, data:any):Observable<Indice>{
    return this.httpClient.patch<Indice>(
      this.contextPath +"/"+id,data)
  }

  public supprimerIndice(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
  public voirIndice(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id
    )}
}

import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Interimes} from "../models/interimes";

@Injectable({
  providedIn: 'root'
})
export class InterimesService {

  public contextPath: string = environment.hostmicroservicepersonnel + "interims";

  constructor(private httpClient: HttpClient) {}

  public listerInterimesPage(page: number, size: number, sort: string): Observable<Interimes> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Interimes>(url, { observe: 'response' });
  }

  public recherchePersonnel(nom: string): Observable<any> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }


  public creerInterimes(data: any): Observable<Interimes> {
    return this.httpClient.post<Interimes>(
      this.contextPath,
      data
    );
  }

  public modifierInterimes(id:any, data:any):Observable<Interimes>{
    return this.httpClient.patch<Interimes>(
      this.contextPath +"/"+id,data)
  }

  public supprimerInterimes(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public voirInterimes(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id
    )}
}

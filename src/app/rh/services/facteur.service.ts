import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Facteur} from "../models/facteur";

@Injectable({
  providedIn: 'root'
})
export class FacteurService {

  public contextPath: string = environment.hostmicroservicepersonnel + "facteurs";

  constructor(private httpClient: HttpClient) {}

  public listerFacteurPage(page: number, size: number, sort: string): Observable<Facteur> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Facteur>(url, { observe: 'response' });
  }

  public rechercheFacteur(nom: string): Observable<Facteur> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<Facteur>(url, { observe: 'response' });
  }

  public creerFacteur(data: any): Observable<Facteur> {
    return this.httpClient.post<Facteur>(
      this.contextPath,
      data
    );
  }

  public modifierFacteur(id:any, data:any):Observable<Facteur>{
    return this.httpClient.patch<Facteur>(
      this.contextPath +"/"+id,data)
  }

  public supprimerFacteur(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
}

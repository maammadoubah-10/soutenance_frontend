import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CritereEvenement} from "../models/critere-evenement";

@Injectable({
  providedIn: 'root'
})
export class CritereEvenementService {

  public contextPath: string = environment.hostmicroservicepersonnel + "critere-evenements";

  constructor(private httpClient: HttpClient) {}

  public listerCritereEvenementPage(page: number, size: number, sort: string): Observable<CritereEvenement> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<CritereEvenement>(url, { observe: 'response' });
  }

  public rechercheCritereEvenementPage(sort: string, designation: string): Observable<CritereEvenement> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<CritereEvenement>(url, { observe: 'response' });
  }

  public creerCritereEvenement(data: any): Observable<CritereEvenement> {
    return this.httpClient.post<CritereEvenement>(
      this.contextPath,
      data
    )
  }

  public modifierCritereEvenement(id:any, data:any):Observable<CritereEvenement>{
    return this.httpClient.patch<CritereEvenement>(
      this.contextPath +"/"+id,data)
  }

  public supprimerCritereEvenement(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public rechercheCritereEvenement(nom: string): Observable<CritereEvenement> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<CritereEvenement>(url, { observe: 'response' });
  }
}

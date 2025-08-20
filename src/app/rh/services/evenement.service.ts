import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Candidature} from "../models/candidature";
import {Evenement} from "../models/evenement";

@Injectable({
  providedIn: 'root'
})
export class EvenementService {

  public contextPath: string = environment.hostmicroservicepersonnel + "evenements";

  constructor(private httpClient: HttpClient) {}

  public listerEvenementPage(page: number, size: number, sort: string): Observable<Evenement> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Evenement>(url, { observe: 'response' });
  }

  public rechercheEvenementPage(sort: string, designation: string): Observable<Evenement> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<Evenement>(url, { observe: 'response' });
  }

  public rechercheEvenement(nom: string): Observable<Evenement> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<Evenement>(url, { observe: 'response' });
  }

  public creerEvenement(data: any): Observable<Evenement> {
    return this.httpClient.post<Evenement>(
      this.contextPath,
      data
    );
  }

  public modifierEvenement(id:any, data:any):Observable<Evenement>{
    return this.httpClient.patch<Evenement>(
      this.contextPath +"/"+id,data)
  }

  public supprimerEvenement(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
}

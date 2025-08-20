import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {StatutCandidature} from "../models/statut-candidature";

@Injectable({
  providedIn: 'root'
})
export class StatutCandidatureService {

  public contextPath: string = environment.hostmicroservicepersonnel + "statut-candidatures";

  constructor(private httpClient: HttpClient) {}

  public listerStatutCandidaturePage(page: number, size: number, sort: string): Observable<StatutCandidature> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<StatutCandidature>(url, { observe: 'response' });
  }

  public rechercheStatutCandidaturePage(sort: string, designation: string): Observable<StatutCandidature> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<StatutCandidature>(url, { observe: 'response' });
  }

  public creerStatutCandidature(data: any): Observable<StatutCandidature> {
    return this.httpClient.post<StatutCandidature>(
      this.contextPath,
      data
    )
  }

  public modifierStatutCandidature(id:any, data:any):Observable<StatutCandidature>{
    return this.httpClient.patch<StatutCandidature>(
      this.contextPath +"/"+id,data)
  }

  public supprimerStatutCandidature(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public rechercheStatutCandidature(nom: string): Observable<StatutCandidature> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<StatutCandidature>(url, { observe: 'response' });
  }
}

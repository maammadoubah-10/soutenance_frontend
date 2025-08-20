import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Candidat} from "../models/candidat";
import {Candidature} from "../models/candidature";

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  public contextPath: string = environment.hostmicroservicepersonnel + "candidatures";

  constructor(private httpClient: HttpClient) {}

  public listerCandidaturePage(page: number, size: number, sort: string): Observable<Candidature> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Candidature>(url, { observe: 'response' });
  }

  public rechercheCandidaturePage(sort: string, designation: string): Observable<Candidature> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<Candidature>(url, { observe: 'response' });
  }

  public rechercheCandidature(nom: string): Observable<Candidature> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<Candidature>(url, { observe: 'response' });
  }

  public creerCandidature(data: any): Observable<Candidature> {
    return this.httpClient.post<Candidature>(
      this.contextPath,
      data
    );
  }

  public modifierCandidature(id:any, data:any):Observable<Candidature>{
    return this.httpClient.patch<Candidature>(
      this.contextPath +"/"+id,data)
  }

  public supprimerCandidature(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public listerCandidatureAvisRecrutement(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/'+ id + '/candidatures'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public voirCandidature(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id
    )}

  public listerEvenementCandidature(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/'+ id + '/evenements'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }
}

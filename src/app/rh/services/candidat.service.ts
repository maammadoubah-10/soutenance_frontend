import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Candidat} from "../models/candidat";

@Injectable({
  providedIn: 'root'
})
export class CandidatService {

  public contextPath: string = environment.hostmicroservicepersonnel + "candidats";

  constructor(private httpClient: HttpClient) {}

  public listerCandidatPage(page: number, size: number, sort: string): Observable<Candidat> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Candidat>(url, { observe: 'response' });
  }

  public rechercheCandidatPage(sort: string, designation: string): Observable<Candidat> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<Candidat>(url, { observe: 'response' });
  }

  public rechercheCandidat(nom: string): Observable<Candidat> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<Candidat>(url, { observe: 'response' });
  }

  public creerCandidat(data: any): Observable<Candidat> {
    return this.httpClient.post<Candidat>(
      this.contextPath,
      data
    );
  }

  public modifierCandidat(id:any, data:any):Observable<Candidat>{
    return this.httpClient.patch<Candidat>(
      this.contextPath +"/"+id,data)
  }

  public supprimerCandidat(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
}

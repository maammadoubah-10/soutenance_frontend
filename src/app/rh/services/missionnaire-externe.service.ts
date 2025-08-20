import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MissionnaireExterne} from "../models/missionnaire-externe";

@Injectable({
  providedIn: 'root'
})
export class MissionnaireExterneService {

  public contextPath: string = environment.hostmicroservicepersonnel + "missionnaire-externes";

  constructor(private httpClient: HttpClient) {}

  public listerMissionnaireExternePage(page: number, size: number, sort: string): Observable<MissionnaireExterne> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<MissionnaireExterne>(url, { observe: 'response' });
  }

  public rechercheMissionnaireExternePageNom( nom: string, page: number, size: number, sort: string): Observable<MissionnaireExterne> {
    const url = `${this.contextPath}?nom=${nom}&page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<MissionnaireExterne>(url, { observe: 'response' });
  }

  public rechercheMissionnaireExternePagePrenom( prenom: string, page: number, size: number, sort: string): Observable<MissionnaireExterne> {
    const url = `${this.contextPath}?prenom=${prenom}&page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<MissionnaireExterne>(url, { observe: 'response' });
  }

  public rechercheMissionnaireExternePageFonction( fonction: string, page: number, size: number, sort: string): Observable<MissionnaireExterne> {
    const url = `${this.contextPath}?fonction=${fonction}&page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<MissionnaireExterne>(url, { observe: 'response' });
  }

  public rechercheMissionnaireExterneNom(nom: string): Observable<MissionnaireExterne> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<MissionnaireExterne>(url, { observe: 'response' });
  }

  public rechercheMissionnaireExternePrenom(prenom: string): Observable<MissionnaireExterne> {
    const url = `${this.contextPath}?prenom=${prenom}`;
    // @ts-ignore
    return this.httpClient.get<MissionnaireExterne>(url, { observe: 'response' });
  }

  public rechercheMissionnaireExterneFonction(fonction: string): Observable<MissionnaireExterne> {
    const url = `${this.contextPath}?fonction=${fonction}`;
    // @ts-ignore
    return this.httpClient.get<MissionnaireExterne>(url, { observe: 'response' });
  }

  public creerMissionnaireExterne(data: any): Observable<MissionnaireExterne> {
    return this.httpClient.post<MissionnaireExterne>(
      this.contextPath,
      data
    );
  }

  public modifierMissionnaireExterne(id:any, data:any):Observable<MissionnaireExterne>{
    return this.httpClient.patch<MissionnaireExterne>(
      this.contextPath +"/"+id,data)
  }

  public supprimerMissionnaireExterne(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
}

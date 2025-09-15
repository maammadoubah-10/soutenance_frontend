import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {MissionPointage} from "../models/mission-pointage";

@Injectable({
  providedIn: 'root'
})
export class MissionPointageService {

  public contextPath: string = environment.hostmicroservicepersonnel + "mission-pointages";

  constructor(private httpClient: HttpClient) {}

  public listerMissionPointagePage(page: number, size: number, sort: string): Observable<MissionPointage> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<MissionPointage>(url, { observe: 'response' });
  }

  public rechercheMissionPointage(nom: string): Observable<MissionPointage> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<MissionPointage>(url, { observe: 'response' });
  }

  public creerMissionPointage(data: any): Observable<MissionPointage> {
    return this.httpClient.post<MissionPointage>(
      this.contextPath,
      data
    );
  }

  public modifierMissionPointage(id:any, data:any):Observable<MissionPointage>{
    return this.httpClient.patch<MissionPointage>(
      this.contextPath +"/"+id,data)
  }

  public supprimerMissionPointage(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  genererEtatDePaiement(id:number): Observable<any> {
    const url = `${this.contextPath+'/'+id+'/generation-etat-paiement'}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers: headers });
  }

  telechargerFraisMission(id:number): Observable<any> {
    const url = `${this.contextPath+'/'+id+'/telechargerfrais'}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers: headers });
  }

}

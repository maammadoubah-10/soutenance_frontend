import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TypeMission} from "../models/type-mission";

@Injectable({
  providedIn: 'root'
})
export class TypeMissionService {

  public contextPath: string = environment.hostmicroservicepersonnel + "type-missions";

  constructor(private httpClient: HttpClient) {}

  public listerTypeMissionPage(page: number, size: number, sort: string): Observable<TypeMission> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<TypeMission>(url, { observe: 'response' });
  }

  public rechercheTypeMissionPage( nom: string, page: number, size: number, sort: string): Observable<TypeMission> {
    const url = `${this.contextPath}?nom=${nom}&page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<TypeMission>(url, { observe: 'response' });
  }

  public rechercheTypeMission(nom: string): Observable<TypeMission> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<TypeMission>(url, { observe: 'response' });
  }

  public creerTypeMission(data: any): Observable<TypeMission> {
    return this.httpClient.post<TypeMission>(
      this.contextPath,
      data
    );
  }

  public modifierTypeMission(id:any, data:any):Observable<TypeMission>{
    return this.httpClient.patch<TypeMission>(
      this.contextPath +"/"+id,data)
  }

  public supprimerTypeMission(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
}

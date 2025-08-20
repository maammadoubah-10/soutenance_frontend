import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {NiveauEtude} from "../models/niveau-etude";

@Injectable({
  providedIn: 'root'
})
export class NiveauEtudeService {

  public contextPath: string = environment.hostmicroservicepersonnel + "niveau-etudes";

  constructor(private httpClient: HttpClient) {}

  public listerNiveauEtudePage(page: number, size: number, sort: string): Observable<NiveauEtude> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<NiveauEtude>(url, { observe: 'response' });
  }

  public rechercheNiveauEtudePage(sort: string, designation: string): Observable<NiveauEtude> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<NiveauEtude>(url, { observe: 'response' });
  }

  public creerNiveauEtude(data: any): Observable<NiveauEtude> {
    return this.httpClient.post<NiveauEtude>(
      this.contextPath,
      data
    )
  }

  public modifierNiveauEtude(id:any, data:any):Observable<NiveauEtude>{
    return this.httpClient.patch<NiveauEtude>(
      this.contextPath +"/"+id,data)
  }

  public supprimerNiveauEtude(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public rechercheNiveauEtude(designation: string): Observable<NiveauEtude> {
    const url = `${this.contextPath}?designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<NiveauEtude>(url, { observe: 'response' });
  }

}

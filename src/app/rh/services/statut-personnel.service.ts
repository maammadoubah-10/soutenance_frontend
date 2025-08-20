import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {StatutPersonnel} from "../models/statut-personnel";

@Injectable({
  providedIn: 'root'
})
export class StatutPersonnelService {

  constructor(private httpClient: HttpClient) {}

  public contextPath: string = environment.hostmicroservicepersonnel + "statut-personnels";

  public listerStatutPersonnelPage(page: number, size: number, sort: string): Observable<StatutPersonnel> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<StatutPersonnel>(url, { observe: 'response' });
  }

  public rechercheStatutPersonnelPage(sort: string, designation: string): Observable<StatutPersonnel> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<StatutPersonnel>(url, { observe: 'response' });
  }

  public rechercheStatutPersonnel(designation: string): Observable<StatutPersonnel> {
    const url = `${this.contextPath}?designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<StatutPersonnel>(url, { observe: 'response' });
  }

  public creerStatutPersonnel(data: any): Observable<StatutPersonnel> {
    return this.httpClient.post<StatutPersonnel>(
      this.contextPath,
      data
    )
  }

  public modifierStatutPersonnel(id:any, data:any):Observable<StatutPersonnel>{
    return this.httpClient.patch<StatutPersonnel>(
      this.contextPath +"/"+id,data)
  }

  public supprimerStatutPersonnel(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
}

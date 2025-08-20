import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ModeDePaiement} from "../models/mode-de-paiement";

@Injectable({
  providedIn: 'root'
})
export class ModeDePaiementService {

  public contextPath: string = environment.hostmicroservicepersonnel + "mode-paiements";

  constructor(private httpClient: HttpClient) {}

  public listerModeDePaiementPage(page: number, size: number, sort: string): Observable<ModeDePaiement> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<ModeDePaiement>(url, { observe: 'response' });
  }

  public rechercheModeDePaiementPage(sort: string, designation: string): Observable<ModeDePaiement> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<ModeDePaiement>(url, { observe: 'response' });
  }

  public rechercheModeDePaiement(designation: string): Observable<ModeDePaiement> {
    const url = `${this.contextPath}?designaiton=${designation}`;
    // @ts-ignore
    return this.httpClient.get<ModeDePaiement>(url, { observe: 'response' });
  }

  public creerModesdepaiement(data: any): Observable<ModeDePaiement> {
    return this.httpClient.post<ModeDePaiement>(
      this.contextPath,
      data
    );
  }

  public modifierModeDePaiement(id:any, data:any):Observable<ModeDePaiement>{
    return this.httpClient.patch<ModeDePaiement>(
      this.contextPath +"/"+id,data)
  }

  public supprimerModedepaiment(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
}

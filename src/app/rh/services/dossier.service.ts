import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Dossier} from "../models/dossier";
import {Banques} from "../models/banques";

@Injectable({
  providedIn: 'root'
})
export class DossierService {

  public contextPath: string = environment.hostmicroservicepersonnel + "type-dossiers";

  constructor(private httpClient: HttpClient) {}

  public listerDossierPage(page: number, size: number, sort: string): Observable<Dossier> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Dossier>(url, { observe: 'response' });
  }

  public rechercheDossierPage(sort: string, designation: string): Observable<Dossier> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<Dossier>(url, { observe: 'response' });
  }

  public creerDossier(data: any): Observable<Dossier> {
    return this.httpClient.post<Dossier>(
      this.contextPath,
      data
    );
  }

  public modifierDossier(id:any, data:any):Observable<Dossier>{
    return this.httpClient.patch<Dossier>(
      this.contextPath +"/"+id,data)
  }

  public supprimerDossier(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public rechercheDossier(designation: string): Observable<Dossier> {
    const url = `${this.contextPath}?designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<Dossier>(url, { observe: 'response' });
  }

}

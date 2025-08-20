import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Dossier} from "../models/dossier";
import {Entites} from "../models/entites";
import {Banques} from "../models/banques";

@Injectable({
  providedIn: 'root'
})
export class EntitesService {

  public contextPath: string = environment.hostmicroservicepersonnel + "entites";

  constructor(private httpClient: HttpClient) {}

  public listerEntitePage(page: number, size: number, sort: string): Observable<Entites> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Entites>(url, { observe: 'response' });
  }

  public rechercheEntitePage(sort: string, designation: string): Observable<Entites> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<Entites>(url, { observe: 'response' });
  }

  public rechercheEntite(designation: string): Observable<Entites> {
    const url = `${this.contextPath}?designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<Entites>(url, { observe: 'response' });
  }

  public creerEntite(data: any): Observable<Entites> {
    return this.httpClient.post<Entites>(
      this.contextPath,
      data
    );
  }

  public modifierEntite(id:any, data:any):Observable<Entites>{
    return this.httpClient.patch<Entites>(
      this.contextPath +"/"+id,data)
  }

  public supprimerEntite(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
}

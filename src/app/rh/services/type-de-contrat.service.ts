import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TypeDeContrat} from "../models/type-de-contrat";

@Injectable({
  providedIn: 'root'
})
export class TypeDeContratService {

  constructor(private httpClient: HttpClient) {}

  public contextPath: string = environment.hostmicroservicepersonnel + "type-contrats";

  public listerTypeDeContratPage(page: number, size: number, sort: string): Observable<TypeDeContrat> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<TypeDeContrat>(url, { observe: 'response' });
  }

  public rechercheTypeDeContratPage(sort: string, designation: string, sigle: string): Observable<TypeDeContrat> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}&sigle=${sigle}`;
    // @ts-ignore
    return this.httpClient.get<TypeDeContrat>(url, { observe: 'response' });
  }

  public creerTypeDeContrat(data: any): Observable<TypeDeContrat> {
    return this.httpClient.post<TypeDeContrat>(
      this.contextPath,
      data
    )
  }

  public modifierTypeDeContrat(id:any, data:any):Observable<TypeDeContrat>{
    return this.httpClient.patch<TypeDeContrat>(
      this.contextPath +"/"+id,data)
  }

  public supprimerTypeDeContrat(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public rechercheTypeDeContrat(sigle: string): Observable<TypeDeContrat> {
    const url = `${this.contextPath}?sigle=${sigle}`;
    // @ts-ignore
    return this.httpClient.get<TypeDeContrat>(url, { observe: 'response' });
  }

}

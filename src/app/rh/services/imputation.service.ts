import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Imputation} from "../models/imputation";

@Injectable({
  providedIn: 'root'
})
export class ImputationService {

  public contextPath: string = environment.hostmicroservicepersonnel + "imputations";

  constructor(private httpClient: HttpClient) {}

  public listerImputationPage(page: number, size: number, sort: string): Observable<Imputation> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Imputations>(url, { observe: 'response' });
  }

  public rechercheImputationPage(sort: string, designation: string): Observable<Imputation> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<Imputations>(url, { observe: 'response' });
  }

  public rechercheImputation(nom: string): Observable<Imputation> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<Entites>(url, { observe: 'response' });
  }

  public creerImputation(data: any): Observable<Imputation> {
    return this.httpClient.post<Imputation>(
      this.contextPath,
      data
    );
  }

  public modifierImputation(id:any, data:any):Observable<Imputation>{
    return this.httpClient.patch<Imputation>(
      this.contextPath +"/"+id,data)
  }

  public supprimerImputation(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
}

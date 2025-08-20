import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Indice} from "../models/indice";
import {Jury} from "../models/jury";

@Injectable({
  providedIn: 'root'
})
export class JuryService {

  public contextPath: string = environment.hostmicroservicepersonnel + "jurys";

  constructor(private httpClient: HttpClient) {}

  public listerJuryPage(page: number, size: number, sort: string): Observable<Jury> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Jury>(url, { observe: 'response' });
  }

  public rechercheJury(nom: string): Observable<Jury> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<Jury>(url, { observe: 'response' });
  }

  public creerJury(data: any): Observable<Jury> {
    return this.httpClient.post<Jury>(
      this.contextPath,
      data
    );
  }

  public modifieJury(id:any, data:any):Observable<Jury>{
    return this.httpClient.patch<Jury>(
      this.contextPath +"/"+id,data)
  }

  public supprimerJury(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

}

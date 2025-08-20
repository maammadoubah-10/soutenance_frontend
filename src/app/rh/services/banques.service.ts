import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Banques} from "../models/banques";
import {Service} from "../models/service";

@Injectable({
  providedIn: 'root'
})
export class BanquesService {

  constructor(private httpClient: HttpClient) {}

  public contextPath: string = environment.hostmicroservicepersonnel + "banques";

  public listerBanquePage(page: number, size: number, sort: string): Observable<Banques> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Banques>(url, { observe: 'response' });
  }

  public rechercheBanquePage(sort: string, designation: string, sigle: string): Observable<Banques> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}&sigle=${sigle}`;
    // @ts-ignore
    return this.httpClient.get<Banques>(url, { observe: 'response' });
  }

  public rechercheBanque(sigle: string): Observable<Banques> {
    const url = `${this.contextPath}?sigle=${sigle}`;
    // @ts-ignore
    return this.httpClient.get<Banques>(url, { observe: 'response' });
  }

  public creerBanque(data: any): Observable<Banques> {
    return this.httpClient.post<Banques>(
      this.contextPath,
      data
    )
  }

  public modifierBanque(id:any, data:any):Observable<Banques>{
    return this.httpClient.patch<Banques>(
      this.contextPath +"/"+id,data)
  }

  public supprimerBanque(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
}

import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Service} from "../models/service";
import {Personnel} from "../models/personnel";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  public contextPath: string = environment.hostmicroservicepersonnel + "services";

  constructor(private httpClient: HttpClient) {}

  public listerServicePage(page: number, size: number, sort: string): Observable<Service> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Service>(url, { observe: 'response' });
  }

  public listerServiceNoPage(): Observable<Service> {
    const url = `${this.contextPath+ '/listes'}`;
    // @ts-ignore
    return this.httpClient.get<Service>(url, { observe: 'response' });
  }

  public listerServiceNoPagePresence(): Observable<Service[]> {
    return this.httpClient.get<Service[]>(this.contextPath +"/listes");
  }

  public listerServiceHierararchiePage(id: number, page: number, size: number, sort: string): Observable<Service> {
    const url = `${this.contextPath + '/' + id + '/services'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Service>(url, { observe: 'response' });
  }


  public rechercheService(sigle: string): Observable<Service> {
    const url = `${this.contextPath}?sigle=${sigle}`;
    // @ts-ignore
    return this.httpClient.get<Service>(url, { observe: 'response' });
  }

  public rechercheServicePage(sigle: string, page: number, size: number, sort: string): Observable<Service> {
    const url = `${this.contextPath}?sigle=${sigle}&page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Service>(url, { observe: 'response' });
  }

  public creerService(data: any): Observable<Service> {
    return this.httpClient.post<Service>(
      this.contextPath,
      data
    );
  }

  public modifierService(id:any, data:any):Observable<Service>{
    return this.httpClient.patch<Service>(
      this.contextPath +"/"+id,data)
  }

  public supprimerService(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public voirService(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id
    )}
  public listePosteService(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id + '/postes'
    )}

  public serviceHierarchiqueService(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id + '/service'
    )}

  public listeServiceHierarchieService(id:number){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id + '/services'
    )}

  public listeServiceOganigramme(): Observable<any> {
    return this.httpClient.get<any>(
      this.contextPath+ '/organigramme'
    )}

  public listerPosteService(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/'+ id + '/postes'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }


  //Paie liens

  private _url:string = environment.hostmicroservicepaie+"services"

  getServices(): Observable<Service[]> {
    return this.httpClient.get<Service[]>(this._url+"/", environment.httpOptions)
  }

}

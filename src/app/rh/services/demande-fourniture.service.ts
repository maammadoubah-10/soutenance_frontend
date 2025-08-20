import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeFourniture } from '../models/demande-fourniture';

@Injectable({
  providedIn: 'root'
})
export class DemandeFournitureService {
  public contextPath: string = environment.hostmicroservicepersonnel + "demande-fourniture";

  constructor(private httpClient: HttpClient) { }

  public createDemandeFourniture(idPersonnel : number,data: any): Observable<DemandeFourniture> {
    const url = `${this.contextPath}/${idPersonnel}`;
    return this.httpClient.post<DemandeFourniture>(
      url,
      data
    );
  }


  public listerDemandeFournitureAViserPersonnel(personnelId: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/monservice/a-viser'}?page=${page}&size=${size}&sort=${sort}&personnelId=${personnelId}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }
  public listerDemandeFournitureASignerPersonnel(personnelId: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/monservice/a-signer'}?page=${page}&size=${size}&sort=${sort}&personnelId=${personnelId}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }
  public listerDemandeFournitureAViserParPoste(personnelId: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/poste/a-viser'}?page=${page}&size=${size}&sort=${sort}&personnelId=${personnelId}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }
  public listerDemandeFournitureASignerParPoste(personnelId: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/poste/a-signer'}?page=${page}&size=${size}&sort=${sort}&personnelId=${personnelId}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }


  public validerFourniture(demandeId: number, personnelId: number): Observable<DemandeFourniture> {
    const url = `${this.contextPath}/${demandeId}/appliquer/${personnelId}/chef/visa`;
    return this.httpClient.post<DemandeFourniture>(url, null);
  }
  public validerSignatureFourniture(demandeId: number, personnelId: number): Observable<DemandeFourniture> {
    const url = `${this.contextPath}/${demandeId}/appliquer/${personnelId}/chef/signature`;
    return this.httpClient.post<DemandeFourniture>(url, null);
}
  public validerVisaFourniturePoste(demandeId: number, personnelId: number): Observable<DemandeFourniture> {
    const url = `${this.contextPath}/${demandeId}/appliquer/${personnelId}/poste/visa`;
    return this.httpClient.post<DemandeFourniture>(url, null);
}
  public validerSignatureFourniturePoste(demandeId: number, personnelId: number): Observable<DemandeFourniture> {
    const url = `${this.contextPath}/${demandeId}/appliquer/poste/${personnelId}/signature`;
    return this.httpClient.post<DemandeFourniture>(url, null);
}
  public refuserVisaFourniturePoste(demandeId: number, personnelId: number, motifRefus : string): Observable<DemandeFourniture> {
    const url = `${this.contextPath}/${demandeId}/chef/${personnelId}/refuser${motifRefus}`;
    return this.httpClient.post<DemandeFourniture>(url, null);
}

public listerDemandeFournitureViserParTous(page: number, size: number, sort: string): Observable<any> {
  const url = `${this.contextPath + '/poste-deja-vise'}?page=${page}&size=${size}&sort=${sort}`;
  // @ts-ignore
  return this.httpClient.get<any>(url, { observe: 'response' });
}

}

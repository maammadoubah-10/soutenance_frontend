import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Diffusion} from "../models/diffusion";

@Injectable({
  providedIn: 'root'
})
export class DiffusionService {

  public contextPath: string = environment.hostmicroservicepersonnel + "diffusions";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private httpClient: HttpClient) {}

  public createDiffusion(diffusionDto: any): Observable<Diffusion> {
    return this.httpClient.post<Diffusion>(this.contextPath, diffusionDto, this.httpOptions);
  }

  public getAllDiffusions(): Observable<Diffusion[]> {
    return this.httpClient.get<Diffusion[]>(this.contextPath);
  }

  public supprimerDossier(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }
  public getAllDiffusionsListing(): Observable<Diffusion[]> {
    return this.httpClient.get<Diffusion[]>(this.contextPath +'/selected');
  }

  // public updateDiffusions(data: any): Observable<Diffusion[]> {
  //   return this.httpClient.patch<Diffusion[]>(`${this.contextPath}/select`, data);
  // }

  public updateDiffusions(id:any, data:any):Observable<Diffusion>{
    return this.httpClient.patch<Diffusion>(
      this.contextPath +"/"+id,data)
  }

  public selectDiffusions(selectedIds: string): Observable<Diffusion[]> {
    const params = new HttpParams().set('selectedIds', selectedIds);
    return this.httpClient.patch<Diffusion[]>(`${this.contextPath}/select`, null, { params });
  }
}

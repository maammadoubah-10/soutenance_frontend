// src/app/.../services/conge.service.ts
import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { Conge } from "../models/conge";

interface PageConge {
  content: Conge[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class CongeService {
  public contextPath = environment.hostmicroservicepersonnel + "conges";

  constructor(private httpClient: HttpClient) {}

  // IMPORTANT: observe: 'response' et bon typage
  listerCongePage(page: number, size: number, sort: string): Observable<HttpResponse<PageConge>> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<PageConge>(url, { observe: 'response' });
  }

  rechercheCongePage(sort: string, designation: string): Observable<HttpResponse<PageConge>> {
    const url = `${this.contextPath}?sort=${sort}&designation=${designation}`;
    return this.httpClient.get<PageConge>(url, { observe: 'response' });
  }

  rechercheConge(nom: string): Observable<HttpResponse<Conge[]>> {
    const url = `${this.contextPath}?nom=${nom}`;
    return this.httpClient.get<Conge[]>(url, { observe: 'response' });
  }

  creerConge(data: FormData): Observable<Conge> {
    return this.httpClient.post<Conge>(this.contextPath, data);
  }

  modifierConge(id: number, data: FormData): Observable<Conge> {
    return this.httpClient.patch<Conge>(`${this.contextPath}/${id}`, data);
  }

  supprimerConge(id: number) {
    return this.httpClient.delete<void>(`${this.contextPath}/${id}`);
  }

  telechargerTitreConge(id: number): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${id}/telecharger`;
    const headers = new HttpHeaders({ Accept: 'application/pdf' });
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers });
  }

  voirConge(id: number) {
    return this.httpClient.get<Conge>(`${this.contextPath}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Personnel } from "../models/personnel";
import { Retenu } from "../models/retenu";
import { Autorisation } from "../models/autorisation";
import { Annif } from "../models/annif";
import { Indice } from "../models/indice";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class PersonnelService {
  public contextPaths: string  = environment.hostmicroservicepersonnel;
  public contextPath: string   = environment.hostmicroservicepersonnel + "personnels";
  public contextPathSign: string = environment.hostmicroservicepersonnel + "signatures";

  constructor(private httpClient: HttpClient) {}

  public listerPersonnelPage(page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerPersonnelConnecterPage(page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/utilisateursConnectes?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerPersonnelNoPage(): Observable<Personnel[]> {
    return this.httpClient.get<Personnel[]>(`${this.contextPath}/listes`);
  }

  public creerIndicePersonnel(personnelId: number, indiceId: number): Observable<Indice> {
    return this.httpClient.post<Indice>(`${this.contextPath}/createIndice/${personnelId}?indiceId=${indiceId}`, null);
  }

  public listerServiceNoPagePdf(): Observable<any> {
    const url = `${this.contextPath}/listes`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public recherchePersonnelMatricule(matricule: string, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}?matricule=${encodeURIComponent(matricule)}&page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public creerAvancementPersonnel(personnelId: number, data: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.contextPath}/${personnelId}/avancementAuChoix`, data);
  }

  public creerAvancementAuChoix(personnelId: number, dateAvancement: string, categorie: string, echelon: string) {
    const url = `${this.contextPath}/${personnelId}/avancementAuChoix`;
    const params = new HttpParams()
      .set('categorie', categorie)
      .set('dateAvancement', dateAvancement)
      .set('echelon', echelon);
    return this.httpClient.patch(url, null, { params });
  }

  public recherchePersonnelNomPage(nom: string, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/parNomPrenom/pages?nom=${encodeURIComponent(nom)}&page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public recherchePersonnelPrenomPage(prenom: string, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/parNomPrenom/pages?prenom=${encodeURIComponent(prenom)}&page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public recherchePersonnelPrenom(prenom: string, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}?prenom=${encodeURIComponent(prenom)}&page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public recherchePersonnel(nom: string): Observable<any> {
    const url = `${this.contextPath}/parNomPrenom?nom=${encodeURIComponent(nom)}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public recherchePersonnelRetenu(search: string): Observable<any> {
    const _url = environment.hostmicroservicepaie + "personnel"; // base paie
    const url = `${_url}/filtrer?search=${encodeURIComponent(search)}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public creerPersonnel(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.contextPath}/createWithEtatCivil`, data);
  }

  public creerPersonnelPoste(personnelId: number, data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.contextPath}/${personnelId}/postesGenerals`, data);
  }

  public modifierPersonnelPoste(personnelId: any, data: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.contextPath}/${personnelId}/postesGenerals`, data);
  }

  public creerPersonnelCoordonnee(personnelId: number, data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.contextPath}/${personnelId}/Createcoordonnees`, data);
  }

  public modifierPersonnelCoordonnee(personnelId: any, data: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.contextPath}/${personnelId}/updateCoordonnees`, data);
  }

  public creerPersonnelOrganismeSocial(personnelId: number, data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.contextPath}/${personnelId}/organismeSocial`, data);
  }

  public modifierPersonnelOrganismeSocial(personnelId: any, data: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.contextPath}/${personnelId}/organismeSocial`, data);
  }

  public modifierPersonnel(id: any, data: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.contextPath}/${id}/updateWithEtatCivil`, data);
  }

  public retraitePersonnelEnGroupe(): Observable<any> {
    return this.httpClient.patch<any>(`${this.contextPath}/retraites`, {});
  }

  public supprimerPersonnel(id: number) {
    return this.httpClient.delete<any>(`${this.contextPath}/delete/personnel/${id}`);
  }

  public voirPersonnel(id: number) {
    return this.httpClient.get<any>(`${this.contextPath}/${id}`);
  }

  // SIGNATURES (avec auth depuis sessionStorage)
  public ajouterSignaturePersonnel(id: number, data: any): Observable<any> {
    const authToken = sessionStorage.getItem("token");
    if (!authToken) throw new Error("Authorization token not found");
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${authToken}` });
    return this.httpClient.post<any>(`${this.contextPathSign}/create/${id}`, data, { headers });
  }

  telechargerSignature(demandeId: number): Observable<Blob> {
    const url = `${this.contextPathSign}/${demandeId}/telecharger`;
    const authToken = sessionStorage.getItem("token");
    if (!authToken) throw new Error("Authorization token not found");
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${authToken}` });
    return this.httpClient.get(url, { responseType: 'blob', headers })
      .pipe(catchError(this.handleError));
  }

  public modifierSignaturePersonnel(id: number, data: any): Observable<any> {
    const authToken = sessionStorage.getItem("token");
    if (!authToken) throw new Error("Authorization token not found");
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${authToken}` });
    return this.httpClient.patch<any>(`${this.contextPathSign}/${id}/update`, data, { headers });
  }

  public recupSignaturePersonnel(id: number): Observable<any> {
    const url = `${this.contextPathSign}/personnel/${id}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public retraitePersonnel(id: any, dateRetraite: Date): Observable<any> {
    const formattedDate = dateRetraite.toISOString().substring(0, 10);
    return this.httpClient.patch<any>(`${this.contextPath}/${id}/retraiter`, { dateRetraite: formattedDate });
  }

  public debaucherPersonnel(id: any, dateDebauchage: Date): Observable<any> {
    const formattedDate = dateDebauchage.toISOString().substring(0, 10);
    return this.httpClient.patch<any>(`${this.contextPath}/${id}/debaucher`, { dateDebauchage: formattedDate });
  }

  public embaucherPersonnel(id: any, dateEmbauchage: Date): Observable<any> {
    const formattedDate = dateEmbauchage.toISOString().substring(0, 10);
    return this.httpClient.patch<any>(`${this.contextPath}/${id}/embaucher`, { dateEmbauchage: formattedDate });
  }

  public listerPresencePersonnel(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/${id}/presences?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerPiecesPersonnel(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/${id}/pieces?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerInterimePersonnel(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/${id}/interims?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerAffectationPersonnel(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/${id}/affectations?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerContratPersonnel(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/${id}/contrats?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerMissionsPersonnel(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/${id}/missions?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerCongesPersonnel(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/${id}/conges?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerDemandesPersonnel(id: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/${id}/demandes?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  obtenirAnniversaires(): Observable<Annif> {
    return this.httpClient.get<Annif>(`${this.contextPath}/anif`);
  }

  public deuxDernierPersonnel(): Observable<any> {
    return this.httpClient.get<any>(`${this.contextPath}/derniers`, { observe: 'response' });
  }

  // ======== Partie paie ========
  private _url: string = environment.hostmicroservicepaie + "personnel";

  getPersonnels(): Observable<Personnel[]> {
    return this.httpClient.get<Personnel[]>(`${this._url}/`, environment.httpOptions);
  }

  getIdDirecteurGeneral(designation: string): Observable<Personnel[]> {
    const url = `${this.contextPath}/findByPosteDesignation/${encodeURIComponent(designation)}`;
    return this.httpClient.get<Personnel[]>(url);
  }

  getPersonnelsFiltrer(search?: string): Observable<Personnel[]> {
    let params = new HttpParams().set('search', search ?? "");
    return this.httpClient.get<Personnel[]>(`${this._url}/filtrer`, { params });
    }

  getPersonnelsMoisAnnee(mois?: string, annee?: string, search?: string): Observable<Personnel[]> {
    let params = new HttpParams()
      .set('mois', mois ?? "")
      .set('annee', annee ?? "")
      .set('search', search ?? "");
    return this.httpClient.get<Personnel[]>(`${this._url}/bulletin/salaire/mois/annee`, { params });
  }

  getPersonnel(id: number): Observable<Personnel> {
    return this.httpClient.get<Personnel>(`${this._url}/${id}`, environment.httpOptions);
  }

  createPersonnel(data: any): Observable<Personnel> {
    return this.httpClient.post<Personnel>(`${this._url}/`, data, environment.httpOptions);
  }

  updatePersonnel(id: number, data: any): Observable<Personnel> {
    return this.httpClient.patch<Personnel>(`${this._url}/${id}`, data, environment.httpOptions);
  }

  deletePersonnel(id: number) {
    return this.httpClient.delete(`${this._url}/${id}`, environment.httpOptions);
  }

  getRetenus(id: number): Observable<Retenu[]> {
    return this.httpClient.get<Retenu[]>(`${this._url}/${id}/retenus`, environment.httpOptions);
  }

  getAutorisations(id: number): Observable<Autorisation[]> {
    return this.httpClient.get<Autorisation[]>(`${this._url}/${id}/autorisations`, environment.httpOptions);
  }

  // utils
  private handleError(error: any): Observable<never> {
    console.error('HTTP error:', error);
    throw new Error('Une erreur s’est produite lors de la requête HTTP.');
  }
}

import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Dossier} from "../models/dossier";
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';

const host = environment.hostmicroservicepedagogie;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class DossierService {

  public contextPath: string = environment.hostmicroservicepedagogie + "dossier";

  constructor(private http: HttpClient) { }

  public listerDossierPage(page: number, size: number, sort: string): Observable<Dossier> {
    const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.http.get<PreInscription>(url, { observe: 'response' });
  }

  public listerDossierNoPagePdf(): Observable<Dossier> {
    const url = `${this.contextPath+ '/listes'}`;
    // @ts-ignore
    return this.http.get<Personnel>(url, { observe: 'response' });
  }

  public afficherLesDossiers(): Observable<Dossier[]>{
    return this.http.get<Dossier[]>(this.contextPath + '/tout')
  }

  public afficherLesDossiersParId(id : any): Observable<Dossier[]>{
    return this.http.get<Dossier[]>(this.contextPath + "/liste/" + id + "/emetteur")
  }

  public listerDossierNoPage(): Observable<Dossier[]> {
    return this.http.get<Dossier[]>(this.contextPath +"/listes");
  }

  public listerDossierParPreinscriptionNoPage(preInscription: any): Observable<Dossier[]> {
    return this.http.get<Dossier[]>(this.contextPath +"/preinscription/" + preInscription);
  }

  public creerDossier(requerantId: any, data: any): Observable<Dossier> {
    return this.http.post<Dossier>(
      this.contextPath + "/creer/" + requerantId, data)
  }

  public modifierDossier(id: any, data: any): Observable<Dossier> {
    return this.http.patch<Dossier>(
      this.contextPath + "/modifier" + id, data)
  }

  public supprimerFichier(id: number) {
    return this.http.delete<any>(this.contextPath + "/" + id);
  }

  telechargerFichier(fileCode: string): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/telechargement/${fileCode}`;

    // Récupérer le token depuis la session storage
    const authToken = sessionStorage.getItem("token");

    // Vérifier si le token est présent
    if (!authToken) {
      throw new Error("Authorization token not found");
    }
    // Ajouter le token à l'en-tête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Utilisation de la méthode HTTP GET pour télécharger le fichier
    return this.http.get(url, { responseType: 'arraybuffer', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }

  private handleError(error: any): Observable<any> {
    console.error('Une erreur s\'est produite:', error);
    throw new Error('Une erreur s\'est produite lors de la requête HTTP.');
  }

  public completerDossier(requerantId: any, preinscriptionId: any, data: any): Observable<Dossier> {
    return this.http.post<Dossier>(
      this.contextPath + "/new/" + requerantId + "/" + preinscriptionId + "/etudiant", data)
  }
}

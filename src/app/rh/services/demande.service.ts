import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Demande} from "../models/demande";
import {catchError} from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  public contextPath: string = environment.hostmicroservicepersonnel + "demandes";

  constructor(private httpClient: HttpClient) {}

  telechargerFichier(demandeId: number): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${demandeId}/telecharger/`;

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
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }

  telechargerFichierDemandeApresValidationDg(demandeId: number): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${demandeId}/telechargerDemande/`;

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
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers })
      .pipe(
        catchError(this.handleError)  // Gérer les erreurs si nécessaire
      );
  }

  private handleError(error: any): Observable<any> {
    console.error('Une erreur s\'est produite:', error);
    throw new Error('Une erreur s\'est produite lors de la requête HTTP.');
  }
  public listerDemandePage(page: number, size: number, sort: string): Observable<Demande> {
    const url = `${this.contextPath+'/encours'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Demandes>(url, { observe: 'response' });
  }

  public listerDemandeRefusePage(page: number, size: number, sort: string): Observable<Demande> {
    const url = `${this.contextPath+'/rejetees'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Demandes>(url, { observe: 'response' });
  }

  public listerDemandeValidePage(page: number, size: number, sort: string): Observable<Demande> {
    const url = `${this.contextPath + '/validees'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Demandes>(url, {observe: 'response'});
  }


  public listerDemandePersonnel(personnelId: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/personnel/'+ personnelId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerDemandeParService(chefId: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/demandes/'+ chefId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }
  public rechercheDemandePage(sort: string, designation: string): Observable<Demande> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<Demande>(url, { observe: 'response' });
  }

  public rechercheDemande(nom: string): Observable<Demande> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<Demande>(url, { observe: 'response' });
  }

  public creerDemande(data: any): Observable<Demande> {
    return this.httpClient.post<Demande>(
      this.contextPath,
      data
    );
  }


  public modifierDemandePersonnel(dateDebut: Date, dateFin: Date, demandeId: number, nbreJour: number): Observable<Demande> {
    const url = `${this.contextPath + '/' +demandeId+ '/chefValidation/oui'}?dateDebut=${dateDebut}&dateFinStr=${dateFin}&nbreJour=${nbreJour}`;
    return this.httpClient.patch<Demande>(url, null);
  }

  public modifierDemandeCsrhPersonnel(demandeId: number, dateDebut: string, dateFin: string, nbreJour: number): Observable<Demande> {
    const url = `${this.contextPath + '/csrh/oui'}?dateDebut=${dateDebut}&dateFin=${dateFin}&demandeId=${demandeId}&nbreJour=${nbreJour}`;
    return this.httpClient.patch<Demande>(url, null);
  }

  public refusDemandeCsrhPersonnel(demandeId: number, message: string): Observable<Demande> {
    const url = `${this.contextPath}/${demandeId}/csrhValidation/non?message=${message}`;
    return this.httpClient.patch<Demande>(url, null);
  }

  public refusDemandePersonnel(demandeId: number, message: string): Observable<Demande> {
    const url = `${this.contextPath}/${demandeId}/chefValidation/non?message=${message}`;
    return this.httpClient.patch<Demande>(url, null);
  }

  public validerDemandeSgPersonnel(demandeId: number): Observable<Demande> {
    const url = `${this.contextPath +  '/sg/oui'}?demandeId=${demandeId}`;
    return this.httpClient.patch<Demande>(url, null);
  }

  public refuserDemandeSgPersonnel(demandeId: number, message: string): Observable<Demande> {
    const url = `${this.contextPath + '/sg/non'}?demandeId=${demandeId}&message=${message}`;
    return this.httpClient.patch<Demande>(url, null);
  }

  public validerDemandeDgPersonnel(demandeId: number): Observable<Demande> {
    const url = `${this.contextPath +  '/dg/oui'}?demandeId=${demandeId}`;
    return this.httpClient.patch<Demande>(url, null);
  }

  public refuserDemandeDgPersonnel(demandeId: number, message: string): Observable<Demande> {
    const url = `${this.contextPath + '/dg/non'}?demandeId=${demandeId}&message=${message}`;
    return this.httpClient.patch<Demande>(url, null);
  }


  public modifierDemande(id:any, data:any):Observable<Demande>{
    return this.httpClient.patch<Demande>(
      this.contextPath +"/"+id,data)
  }

  public supprimerDemande(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public voirDemande(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id
    )}
}

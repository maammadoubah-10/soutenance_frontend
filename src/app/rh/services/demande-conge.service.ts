import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {DemandeConge} from "../models/demande-conge";

@Injectable({
  providedIn: 'root'
})
export class DemandeCongeService {
  public contextPath: string = environment.hostmicroservicepersonnel + "conges";

  constructor(private httpClient: HttpClient) {}

  telechargerFichier(congeId: number): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${congeId}/telecharger/`;

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

  telechargerFichierDemandeCongeApresValidationDg(DemandeCongeId: number): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${DemandeCongeId}/telechargerDemandeConge/`;

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
  public listerDemandeCongePage(page: number, size: number, sort: string): Observable<DemandeConge> {
    const url = `${this.contextPath+'/encours'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<DemandeConge>(url, { observe: 'response' });
  }

  public listerDemandeCongeRefusePage(page: number, size: number, sort: string): Observable<DemandeConge> {
    const url = `${this.contextPath+'/rejetees'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<DemandeConge>(url, { observe: 'response' });
  }

  public listerDemandeCongeValidePage(page: number, size: number, sort: string): Observable<DemandeConge> {
    const url = `${this.contextPath + '/validees'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<DemandeConge>(url, {observe: 'response'});
  }


  public listerDemandeCongePersonnel(personnelId: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/personnel/'+ personnelId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerDemandeCongeChefPersonnel(personnelId: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/conges/'+ personnelId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerDemandeCongeParService(chefId: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/DemandeConge/'+ chefId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }
  public rechercheDemandeCongePage(sort: string, designation: string): Observable<DemandeConge> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<DemandeConge>(url, { observe: 'response' });
  }

  public rechercheDemandeConge(nom: string): Observable<DemandeConge> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<DemandeConge>(url, { observe: 'response' });
  }

  public creerDemandeConge(data: any): Observable<DemandeConge> {
    return this.httpClient.post<DemandeConge>(
      this.contextPath,
      data
    );
  }


  public modifierDemandeCongePersonnel(dateDebutStr: Date, dateFinStr: Date, DemandeCongeId: number, nbreJour: number): Observable<DemandeConge> {
    const url = `${this.contextPath + '/' +DemandeCongeId+ '/chefValidation/oui'}?dateDebutStr=${dateDebutStr}&dateFinStr=${dateFinStr}&nbreJour=${nbreJour}`;
    return this.httpClient.patch<DemandeConge>(url, null);
  }

  public modifierDemandeCongeCsrhPersonnel(congeId: number, dateDebut: string, dateFin: string, dateReprise: string, nbreJour: number): Observable<DemandeConge> {
    const url = `${this.contextPath + '/csrh/oui'}?dateDebut=${dateDebut}&dateFin=${dateFin}&dateReprise=${dateReprise}&congeId=${congeId}&nbreJour=${nbreJour}`;
    return this.httpClient.patch<DemandeConge>(url, null);
  }

  public refusDemandeCongePersonnel(demandeId: number, message: string): Observable<DemandeConge> {
    const url = `${this.contextPath}/${demandeId}/chefValidation/non?message=${message}`;
    return this.httpClient.patch<DemandeConge>(url, null);
  }

  public validerDemandeCongePersonnel(dateDebut: Date, dateFin: Date, demandeId: number, nbreJour: number): Observable<DemandeConge> {
    const url = `${this.contextPath + '/' +demandeId+ '/chefValidation/oui'}?dateDebut=${dateDebut}&dateFin=${dateFin}&nbreJour=${nbreJour}`;
    return this.httpClient.patch<DemandeConge>(url, null);
  }

  public refusDemandeCongeCsrhPersonnel(congeId: number, message: string): Observable<DemandeConge> {
    const url = `${this.contextPath}/${congeId}/csrhValidation/non?message=${message}`;
    return this.httpClient.patch<DemandeConge>(url, null);
  }

  // public refusDemandeCongePersonnel(DemandeCongeId: number, message: string): Observable<DemandeConge> {
  //   const url = `${this.contextPath}/${DemandeCongeId}/chefValidation/non?message=${message}`;
  //   return this.httpClient.patch<DemandeConge>(url, null);
  // }

  public validerDemandeCongeSgPersonnel(congeId: number): Observable<DemandeConge> {
    const url = `${this.contextPath +  '/sg/oui'}?congeId=${congeId}`;
    return this.httpClient.patch<DemandeConge>(url, null);
  }

  public refuserDemandeCongeSgPersonnel(congeId: number, message: string): Observable<DemandeConge> {
    const url = `${this.contextPath + '/sg/non'}?congeId=${congeId}&message=${message}`;
    return this.httpClient.patch<DemandeConge>(url, null);
  }

  public validerDemandeCongeDgPersonnel(congeId: number): Observable<DemandeConge> {
    const url = `${this.contextPath +  '/dg/oui'}?congeId=${congeId}`;
    return this.httpClient.patch<DemandeConge>(url, null);
  }

  public refuserDemandeCongeDgPersonnel(congeId: number, message: string): Observable<DemandeConge> {
    const url = `${this.contextPath + '/dg/non'}?congeId=${congeId}&message=${message}`;
    return this.httpClient.patch<DemandeConge>(url, null);
  }


  public modifierDemandeConge(id:any, data:any):Observable<DemandeConge>{
    return this.httpClient.patch<DemandeConge>(
      this.contextPath +"/"+id,data)
  }

  public supprimerDemandeConge(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }

  public voirDemandeConge(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id
    )}
}

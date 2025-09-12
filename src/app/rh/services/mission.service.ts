import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Mission} from "../models/mission";
import {MissionPointage} from "../models/mission-pointage";
import {Demande} from "../models/demande";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MissionService {

  public contextPath: string = environment.hostmicroservicepersonnel + "missions";

  constructor(private httpClient: HttpClient) {}
  //
  // public listerMissionPage(page: number, size: number, sort: string): Observable<Mission> {
  //   const url = `${this.contextPath}?page=${page}&size=${size}&sort=${sort}`;
  //   // @ts-ignore
  //   return this.httpClient.get<Mission>(url, { observe: 'response' });
  // }
  //
  // public rechercheMissionPage( reference: string, page: number, size: number, sort: string): Observable<Mission> {
  //   const url = `${this.contextPath}?reference=${reference}&page=${page}&size=${size}&sort=${sort}`;
  //   // @ts-ignore
  //   return this.httpClient.get<Mission>(url, { observe: 'response' });
  // }
  //
  // public rechercheMission(reference: string): Observable<Mission> {
  //   const url = `${this.contextPath}?reference=${reference}`;
  //   // @ts-ignore
  //   return this.httpClient.get<Mission>(url, { observe: 'response' });
  // }
  //
  // public listerPointageParMissionPage(id:number, page: number, size: number, sort: string): Observable<MissionPointage> {
  //   const url = `${this.contextPath}/${id}/missionpointages?page=${page}&size=${size}&sort=${sort}`;
  //   // @ts-ignore
  //   return this.httpClient.get<MissionPointage>(url, { observe: 'response' });
  // }
  //
  // public creerMission(data: any): Observable<Mission> {
  //   return this.httpClient.post<Mission>(
  //     this.contextPath,
  //     data
  //   );
  // }
  //
  // public modifierMission(id:any, data:any):Observable<Mission>{
  //   return this.httpClient.patch<Mission>(
  //     this.contextPath +"/"+id,data)
  // }
  //
  //
  public ajouterLeRapport(id:any, data:any):Observable<Mission>{
    return this.httpClient.patch<Mission>(
      this.contextPath +"/"+id+"/rapport",data)
  }
  //
  // public supprimerMission(id: number) {
  //   return this.httpClient.delete<any>(this.contextPath + "/" + id);
  // }
  //
  // genererEtatDePaiement(id:number): Observable<any> {
  //   const url = `${this.contextPath+'/'+id+'/generation-etat-paiement'}`;
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });
  //   return this.httpClient.get(url, { responseType: 'arraybuffer', headers: headers });
  // }
  //
  // telechargerFraisMission(id:number): Observable<any> {
  //   const url = `${this.contextPath+'/'+id+'/telechargerfrais'}`;
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });
  //   return this.httpClient.get(url, { responseType: 'arraybuffer', headers: headers });
  // }
  //
  // telechargerOrdreMission(id:number): Observable<any> {
  //   const url = `${this.contextPath+'/'+id+'/telechargerordre'}`;
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });
  //   return this.httpClient.get(url, { responseType: 'arraybuffer', headers: headers });
  // }


  public voirMission(id:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/'+id
    )}


  ///////////////////////////////////////MISSIONS NEW

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

  public listerMissionPage(page: number, size: number, sort: string): Observable<Mission> {
    const url = `${this.contextPath+'/encours'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Mission>(url, { observe: 'response' });
  }

  public listerMissionRefusePage(page: number, size: number, sort: string): Observable<Mission> {
    const url = `${this.contextPath+'/rejetees'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Mission>(url, { observe: 'response' });
  }

  public listerMissionValidePage(page: number, size: number, sort: string): Observable<Mission> {
    const url = `${this.contextPath + '/validees'}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<Mission>(url, {observe: 'response'});
  }


  public listerMissionPersonnel(personnelId: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/personnel/'+ personnelId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerMissionParService(chefId: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath + '/missions/'+ chefId}?page=${page}&size=${size}&sort=${sort}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, { observe: 'response' });
  }
  public rechercheMissionPage(sort: string, designation: string): Observable<Mission> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    // @ts-ignore
    return this.httpClient.get<Mission>(url, { observe: 'response' });
  }

  public rechercheMission(nom: string): Observable<Mission> {
    const url = `${this.contextPath}?nom=${nom}`;
    // @ts-ignore
    return this.httpClient.get<Mission>(url, { observe: 'response' });
  }

  public creerMission(data: any): Observable<Mission> {
    return this.httpClient.post<Mission>(
      this.contextPath,
      data
    );
  }


  public validerChefMissionPersonnel(dateDebut: Date, dateFin: Date, missionId: number, nbreJour: number): Observable<Mission> {
    const url = `${this.contextPath + '/' +missionId+ '/chefValidation/oui'}?dateDebut=${dateDebut}&dateFinStr=${dateFin}&nbreJour=${nbreJour}`;
    return this.httpClient.patch<Mission>(url, null);
  }
  
  public modifierMissionCsrhPersonnel(missionId: number, dateDebut: string, dateFin: string, nbreJour: number): Observable<Mission> {
    const url = `${this.contextPath + '/csrh/oui'}?dateDebut=${dateDebut}&dateFin=${dateFin}&missionId=${missionId}&nbreJour=${nbreJour}`;
    return this.httpClient.patch<Mission>(url, null);
  }

  public refusMissionCsrhPersonnel(missionId: number, message: string): Observable<Mission> {
    const url = `${this.contextPath}/${missionId}/csrhValidation/non?message=${message}`;
    return this.httpClient.patch<Mission>(url, null);
  }

  public refusChefMissionPersonnel(missionId: number, message: string): Observable<Mission> {
    const url = `${this.contextPath}/${missionId}/chefValidation/non?message=${message}`;
    return this.httpClient.patch<Mission>(url, null);
  }

  public validerMissionSgPersonnel(missionId: number): Observable<Mission> {
    const url = `${this.contextPath +  '/sg/oui'}?missionId=${missionId}`;
    return this.httpClient.patch<Mission>(url, null);
  }

  public refuserMissionSgPersonnel(missionId: number, message: string): Observable<Mission> {
    const url = `${this.contextPath + '/sg/non'}?MissionId=${missionId}&message=${message}`;
    return this.httpClient.patch<Mission>(url, null);
  }

  public validerMissionDgPersonnel(missionId: number): Observable<Mission> {
    const url = `${this.contextPath +  '/dg/oui'}?missionId=${missionId}`;
    return this.httpClient.patch<Mission>(url, null);
  }

  public refuserMissionDgPersonnel(missionId: number, message: string): Observable<Mission> {
    const url = `${this.contextPath + '/dg/non'}?missionId=${missionId}&message=${message}`;
    return this.httpClient.patch<Mission>(url, null);
  }


  public modifierMission(id:any, data:any):Observable<Mission>{
    return this.httpClient.patch<Mission>(
      this.contextPath +"/"+id,data)
  }

  public supprimerMission(id: number) {
    return this.httpClient.delete<any>(this.contextPath + "/" + id);
  }


}

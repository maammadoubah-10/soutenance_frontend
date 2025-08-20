import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Onlyoffice} from "../models/onlyoffice";
import {catchError} from "rxjs/operators";
import {GLOBAL_CONFIG} from "../../commun/models/global";

@Injectable({
  providedIn: 'root'
})
export class OnlyofficeService {

  public contextPathLocal: string = environment.hostmicroservicepersonnel + "onlyOfficeEditions";
  public contextPath: string = environment.hostmicroservicepersonnelonlinee + "onlyOfficeModels";
  public contextPathEditon: string = environment.hostmicroservicepersonnelonline + "onlyOfficeEditions";
  public contextPathCourrier: string = environment.hostmicroservicecourrier + "onlyOffice";
  public contextPathCourriers: string = environment.hostmicroservicecourrier + "onlyOfficeModels";

  constructor(private httpClient: HttpClient) {
  }

  public creerOnlyofficeModel(onlyOfficeModel: any): Observable<Onlyoffice> {
    return this.httpClient.post<Onlyoffice>(
      this.contextPath,
      onlyOfficeModel
    );
  }

  public creerOnlyofficeModelAll(onlyOfficeModel: any): Observable<Onlyoffice> {
    return this.httpClient.post<Onlyoffice>(
      this.contextPathCourriers,
      onlyOfficeModel
    );
  }

  public mettreAJourOnlyofficeModel(id: number,onlyOfficeModel: any): Observable<Onlyoffice> {
    return this.httpClient.patch<Onlyoffice>(
      `${this.contextPathCourriers}/${id}`,
      onlyOfficeModel
    );
  }


  public validerEnregistrerEditionCsrh(typeId: number): Observable<Onlyoffice> {
    const service = 'CSRH'; // Remplacez cela par la valeur souhaitée
    const type = 'Absence'; // Remplacez cela par la valeur souhaitée

    const url = `${this.contextPathLocal}/${service}/${type}/${typeId}`;
    // Utilisation de la méthode post au lieu de get
    return this.httpClient.post<Onlyoffice>(url, {observe: 'response'});
  }


  public recupTousLesModelCreerPourUnCourrier(courrierId: number): Observable<any> {
    const url = `${this.contextPathCourrier}/courrier/${courrierId}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, {observe: 'response'});
  }

  public recupModelDocxCreerPourUnCourrier(editionId: number): Observable<any> {
    const url = `${this.contextPathCourrier}/download/editionId${editionId}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, {observe: 'response'});
  }


  public listeAllModel(): Observable<any> {
    const url = `${this.contextPath}`;
    // @ts-ignore
    return this.httpClient.get<any>(url, {observe: 'response'});
  }

  public recupModelParService(): Observable<any> {
    const url = `${this.contextPath}/byServiceAndType/CSRH/Administratif`;
    return this.httpClient.get<any>(url, {observe: 'response'});
  }

  public recupModelSimple(): Observable<any> {
    const url = `${this.contextPath}/byServiceAndType/CSRH/Absence`;
    return this.httpClient.get<any>(url, {observe: 'response'});
  }
  public recupModelParServiceDemandeAbsence(): Observable<any> {
    const url = `${this.contextPath}/byServiceAndType/CSRH/Absence`;
    return this.httpClient.get<any>(url, {observe: 'response'});
  }

  public recupTousLesModelParPoste(posteId: number): Observable<any> {
    const url = `${this.contextPathCourriers}/poste/${posteId}`;
    return this.httpClient.get<any>(url, {observe: 'response'});
  }

  public recupModelParServiceDemandeMission(): Observable<any> {
    const url = `${this.contextPath}/byServiceAndType/CSRH/Mission`;
    return this.httpClient.get<any>(url, {observe: 'response'});
  }

  public recupModelParServiceDemandeConge(): Observable<any> {
    const url = `${this.contextPath}/byServiceAndType/CSRH/Conge`;
    return this.httpClient.get<any>(url, {observe: 'response'});
  }

  public recupModelDejaEnregitrerParDemande(id: number): Observable<any> {
    const url = `${this.contextPathEditon}/byServiceAndType/${GLOBAL_CONFIG.SIGLE_PERSONNEL_ONLYOFFICE_EDITION}/Administratif/` + id;
    return this.httpClient.get<any>(url, {observe: 'response'});
  }

  public recupModelDejaEnregitrerParDemandeAbscence(id: number): Observable<any> {
    const url = `${this.contextPathEditon}/byServiceAndType/${GLOBAL_CONFIG.SIGLE_PERSONNEL_ONLYOFFICE_EDITION}/Absence/` + id;
    return this.httpClient.get<any>(url, {observe: 'response'});
  }

  public recupModelDejaEnregitrerParDemandeMission(id: number): Observable<any> {
    const url = `${this.contextPathEditon}/byServiceAndType/${GLOBAL_CONFIG.SIGLE_PERSONNEL_ONLYOFFICE_EDITION}/Mission/` + id;
    return this.httpClient.get<any>(url, {observe: 'response'});
  }

  public recupModelDejaEnregitrerParDemandeConge(id: number): Observable<any> {
    const url = `${this.contextPathEditon}/byServiceAndType/${GLOBAL_CONFIG.SIGLE_PERSONNEL_ONLYOFFICE_EDITION}/Conge/` + id;
    return this.httpClient.get<any>(url, {observe: 'response'});
  }


  // public recupModelFinEditionDemande(id : number): Observable<any> {
  //   const url = `${this.contextPathEditon}/CSRH/Administratif/` + id + '/telecharger' ;
  //   return this.httpClient.get<any>(url, { observe: 'response' });
  // }

  // public recupModelFinEditionDemande(id: number): Observable<HttpResponse<ArrayBuffer>> {
  //   const url = `${this.contextPathEditon}/CSRH/Administratif/${id}/telechargerPDF`;
  //
  //   // Définir le type de réponse en tant que blob (pour les fichiers)
  //   return this.httpClient.get(url, {
  //     responseType: 'arraybuffer',
  //     observe: 'response'
  //   });
  // }


  // Fonction pour récupérer l'URL de téléchargement du PDF
  recupModelFinEditionDemandeAbsence(demandeId: number): Observable<Blob> {
    const url = `${this.contextPathEditon}/${GLOBAL_CONFIG.RH_CSRH_DIM}/Absence/${demandeId}/telechargerPDF`;

    // Retourner le contenu du PDF sous forme d'objet Blob
    return this.httpClient.get(url, { responseType: 'blob' });
  }

  recupModelFinEditionDemandeAdministratif(demandeId: number): Observable<Blob> {
    const url = `${this.contextPathEditon}/${GLOBAL_CONFIG.RH_CSRH_DIM}/Administratif/${demandeId}/telechargerPDF`;

    // Retourner le contenu du PDF sous forme d'objet Blob
    return this.httpClient.get(url, { responseType: 'blob' });
  }

  recupModelFinEditionDemandeConge(demandeId: number): Observable<Blob> {
    const url = `${this.contextPathEditon}/${GLOBAL_CONFIG.RH_CSRH_DIM}/Conge/${demandeId}/telechargerPDF`;

    // Retourner le contenu du PDF sous forme d'objet Blob
    return this.httpClient.get(url, { responseType: 'blob' });
  }

  recupModelFinEditionDemandeMission(demandeId: number): Observable<Blob> {
    const url = `${this.contextPathEditon}/${GLOBAL_CONFIG.RH_CSRH_DIM}/Mission/${demandeId}/telechargerPDF`;

    // Retourner le contenu du PDF sous forme d'objet Blob
    return this.httpClient.get(url, { responseType: 'blob' });
  }
  private handleError(error: any): Observable<any> {
    console.error('Une erreur s\'est produite:', error);
    throw new Error('Une erreur s\'est produite lors de la requête HTTP.');
  }


  convertDocument(requestData: any): Observable<any> {
    const url = 'https://161.97.172.232:8443/ConvertService.ashx';

    // Ajoutez les en-têtes requis si nécessaire
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    console.log('Data sent:', requestData)
    // Envoyer la requête POST avec les données JSON dans le corps
    return this.httpClient.post(url, requestData, {headers: headers});
  }
}

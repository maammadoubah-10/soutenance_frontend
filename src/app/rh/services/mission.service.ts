// src/app/rh/services/mission.service.ts
import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Mission } from "../models/mission";
import { MissionPointage } from "../models/mission-pointage";

@Injectable({ providedIn: 'root' })
export class MissionService {

  // ex: http://localhost:9002/rh/ + "missions" => http://localhost:9002/rh/missions
  public contextPath: string = environment.hostmicroservicepersonnel + "missions";

  constructor(private httpClient: HttpClient) {}

  // ===========================
  // PAGE POINTAGE
  // ===========================
  public listerPointageParMissionPage(
    id: number,
    page: number,
    size: number,
    sort: string
  ): Observable<any> {
    const url = `${this.contextPath}/${id}/missionpointages?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<MissionPointage>(url, { observe: 'response' });
  }

  // ===========================
  // ÉLIGIBILITÉ
  // ===========================
  // Vérifie l’éligibilité (renvoie { eligible, reason?, chefId? })
  verifierEligibilite(
    personnelId: number,
    dateDebut?: string,
    dateFin?: string
  ): Observable<{ eligible: boolean; reason?: string; chefId?: number }> {
    let url = `${this.contextPath}/eligibilite?personnelId=${personnelId}`;
    if (dateDebut) url += `&dateDebut=${encodeURIComponent(dateDebut)}`;
    if (dateFin)   url += `&dateFin=${encodeURIComponent(dateFin)}`;
    return this.httpClient.get<{ eligible: boolean; reason?: string; chefId?: number }>(url);
  }

  // ===========================
  // TÉLÉCHARGEMENTS PDF
  // ===========================

  telechargerFraisMission(id: number): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${id}/telecharger`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers });
  }

  telechargerappports(id: number): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${id}/telecharger`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers });
  }

  telechargerOrdreMission(id: number): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${id}/telechargerMission`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers });
  }

  // Générer l’état de paiement
  genererEtatDePaiement(id: number): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${id}/generation-etat-paiement`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers });
  }

  // ===========================
  // CONSULTATION
  // ===========================

  public voirMission(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.contextPath}/${id}`);
  }

  telechargerFichier(demandeId: number): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${demandeId}/telecharger/`;
    const authToken = sessionStorage.getItem("token");
    if (!authToken) return throwError(() => new Error("Authorization token not found"));

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${authToken}` });
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers })
      .pipe(catchError(this.handleError));
  }

  telechargerFichierDemandeApresValidationDg(demandeId: number): Observable<ArrayBuffer> {
    const url = `${this.contextPath}/${demandeId}/telechargerDemande/`;
    const authToken = sessionStorage.getItem("token");
    if (!authToken) return throwError(() => new Error("Authorization token not found"));

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${authToken}` });
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('Une erreur s\'est produite:', error);
    return throwError(() => new Error('Une erreur s\'est produite lors de la requête HTTP.'));
  }

  // ===========================
  // LISTES & RECHERCHES
  // ===========================

  // missions en cours
 public listerMissionPage(page: number, size: number, sort: string): Observable<any> {
  const sortParam =
    sort?.toLowerCase() === 'desc' || sort?.toLowerCase() === 'asc'
      ? `id,${sort}`
      : (sort || 'id,desc');

  // 👉 même logique que les congés : on tape directement sur /missions
  const url = `${this.contextPath}?page=${page}&size=${size}&sort=${encodeURIComponent(sortParam)}`;
  return this.httpClient.get<Mission>(url, { observe: 'response' });
}


  public listerMesMissions(page: number, size: number, sort: string): Observable<any> {
    const sortParam =
      sort?.toLowerCase() === 'desc' || sort?.toLowerCase() === 'asc'
        ? `id,${sort}`
        : (sort || 'id,desc');

    const url = `${this.contextPath}/moi?page=${page}&size=${size}&sort=${encodeURIComponent(sortParam)}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerMissionRefusePage(page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/rejetees?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<Mission>(url, { observe: 'response' });
  }

  public listerMissionValidePage(page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/validees?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<Mission>(url, { observe: 'response' });
  }

  public listerMissionPersonnel(personnelId: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/personnel/${personnelId}?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public listerMissionParService(chefId: number, page: number, size: number, sort: string): Observable<any> {
    const url = `${this.contextPath}/missions/${chefId}?page=${page}&size=${size}&sort=${sort}`;
    return this.httpClient.get<any>(url, { observe: 'response' });
  }

  public rechercheMissionPage(sort: string, designation: string): Observable<any> {
    const url = `${this.contextPath}?&sort=${sort}&designation=${designation}`;
    return this.httpClient.get<Mission>(url, { observe: 'response' });
  }

  public rechercheMission(nom: string): Observable<any> {
    const url = `${this.contextPath}?nom=${nom}`;
    return this.httpClient.get<Mission>(url, { observe: 'response' });
  }

  // ===========================
  // CRÉATION / MODIFICATION / SUPPRESSION
  // ===========================

  // Création mission (multipart/FormData)
  public creerMission(data: FormData): Observable<Mission> {
    return this.httpClient.post<Mission>(this.contextPath, data);
  }

  // Ajouter un rapport (multipart/FormData)
  public ajouterLeRapport(id: number, formData: FormData): Observable<Mission> {
    const url = `${this.contextPath}/${id}/rapport`;
    return this.httpClient.patch<Mission>(url, formData);
  }

  public validerChefMissionPersonnel(
    dateDebut: Date,
    dateFin: Date,
    missionId: number,
    nbreJour: number
  ): Observable<Mission> {
    const url =
      `${this.contextPath}/${missionId}/chefValidation/oui?` +
      `dateDebut=${dateDebut}&dateFinStr=${dateFin}&nbreJour=${nbreJour}`;
    return this.httpClient.patch<Mission>(url, null);
  }

  public modifierMissionCsrhPersonnel(
    missionId: number,
    dateDebut: string,
    dateFin: string,
    nbreJour: number
  ): Observable<Mission> {
    const url =
      `${this.contextPath}/csrh/oui?dateDebut=${dateDebut}&dateFin=${dateFin}` +
      `&missionId=${missionId}&nbreJour=${nbreJour}`;
    return this.httpClient.patch<Mission>(url, null);
  }

  public refusMissionCsrhPersonnel(missionId: number, message: string): Observable<Mission> {
    const url = `${this.contextPath}/${missionId}/csrhValidation/non?message=${encodeURIComponent(message)}`;
    return this.httpClient.patch<Mission>(url, null);
  }

  public refusChefMissionPersonnel(missionId: number, message: string): Observable<Mission> {
    const url = `${this.contextPath}/${missionId}/chefValidation/non?message=${encodeURIComponent(message)}`;
    return this.httpClient.patch<Mission>(url, null);
  }

  public validerMissionSgPersonnel(missionId: number): Observable<Mission> {
    const url = `${this.contextPath}/sg/oui?missionId=${missionId}`;
    return this.httpClient.patch<Mission>(url, null);
  }

  public refuserMissionSgPersonnel(missionId: number, message: string): Observable<Mission> {
    const url = `${this.contextPath}/sg/non?MissionId=${missionId}&message=${encodeURIComponent(message)}`;
    return this.httpClient.patch<Mission>(url, null);
  }

  public validerMissionDgPersonnel(missionId: number): Observable<Mission> {
    const url = `${this.contextPath}/dg/oui?missionId=${missionId}`;
    return this.httpClient.patch<Mission>(url, null);
  }

  public refuserMissionDgPersonnel(missionId: number, message: string): Observable<Mission> {
    const url = `${this.contextPath}/dg/non?missionId=${missionId}&message=${encodeURIComponent(message)}`;
    return this.httpClient.patch<Mission>(url, null);
  }

  public modifierMission(id: number, data: FormData): Observable<Mission> {
    return this.httpClient.patch<Mission>(`${this.contextPath}/${id}`, data);
  }

  public supprimerMission(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.contextPath}/${id}`);
  }

  // ===========================
  // ACTIONS SUR LE CYCLE DE VIE D'UNE MISSION
  // ===========================

  // Soumettre la mission (ça, ton back l'a sûrement)
  public soumettre(id: number) {
  return this.httpClient.post<Mission>(`${this.contextPath}/${id}/soumettre`, {});
}

// Approbation RH
public approuverRh(id: number) {
  return this.httpClient.post<Mission>(`${this.contextPath}/${id}/approuver-rh`, {});
}

  /**
   * Rejet RH avec motif
   * 👉 On réutilise l'endpoint existant : /{id}/csrhValidation/non
   */
 public rejeterRh(id: number, motif: string = 'Rejeté par RH') {
  return this.httpClient.post<Mission>(
    `${this.contextPath}/${id}/rejeter-rh`,
    { motif }
  );
}

// Marquer mission comme prise
public marquerPris(id: number) {
  return this.httpClient.post<Mission>(`${this.contextPath}/${id}/marquer-pris`, {});
}

  // Marquer mission terminée
  public marquerTerminee(id: number): Observable<Mission> {
    const url = `${this.contextPath}/${id}/terminer`;
    return this.httpClient.post<Mission>(url, {});
  }

  // Clôturer la mission
  public cloturer(id: number) {
  return this.httpClient.post<Mission>(`${this.contextPath}/${id}/cloturer`, {});
}

}

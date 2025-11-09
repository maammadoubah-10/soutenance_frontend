import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DataStateEnum } from '../../state/state';
import { tap } from 'rxjs/operators';
import { LoginResponse } from '../models/auth.types';

const host = environment.hostmicroserviceutilisateur;
const hostPedago = environment.hostmicroservicepedagogie;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const httpOptionsJson = httpOptions;

@Injectable({ providedIn: 'root' })
export class AuthentificationService {
  public token: string | undefined;

  constructor(private http: HttpClient, private router: Router) {}

 connexion(email: string, motdepasse: string) {
  return this.http.post<LoginResponse>(
    host + 'utilisateurs/connexion/',
    { email, motdepasse },
    httpOptionsJson
  ).pipe(
    tap((res: any) => {
      const token: string = res?.token ?? res?.accessToken ?? '';
      const perms: string[] = Array.isArray(res?.permissions) ? res.permissions : [];
      const isAdmin = !!res?.isAdmin || perms.map(p => String(p).toLowerCase()).includes('admin');
      this.sauvegarderDansLaSession(token, email, perms, isAdmin);
    })
  );
}

  /** ====== ADMIN / RÔLES ====== */
  isAdmin(): boolean {
    const fromFlag = sessionStorage.getItem('isAdmin') === 'true';
    const fromPerms = (this.getPermissions().map(p => p.toLowerCase())).includes('admin');
    return fromFlag || fromPerms;
  }

  getPermissions(): string[] {
    try { return JSON.parse(sessionStorage.getItem('permissions') || '[]'); }
    catch { return []; }
  }

  estAdminLocal(utilisateur: any): boolean {
    // si backend renvoie est_admin ou estAdmin
    return !!(utilisateur?.est_admin ?? utilisateur?.estAdmin);
  }

  /** ====== UTILISATEUR COURANT ====== */
  /** getMe(): par défaut, récupère l’email stocké en session, puis fetch le profil */
  /** Récupère le profil courant et recalcule isAdmin au besoin */
getMe(): Observable<any> {
  const email = (sessionStorage.getItem('email') || '').trim();
  const req$ = email
    ? this.obtenirUnUtilisateurParEmail(email)
    : this.http.get<any>(host + 'utilisateurs/me', httpOptions);

  return req$.pipe(
    tap(user => {
      if (user) {
        const fromFlag = !!(user.est_admin ?? user.estAdmin);
        const roles = (user.roles ?? user.roleList ?? []).map((r:any)=> (r?.nom||r).toString().toUpperCase());
        const fromRoles = roles.some((r:string)=> r.includes('ADMIN'));
        const isAdmin = fromFlag || fromRoles || this.isAdmin(); // garde le plus permissif
        this.sauvegarderDansLaSession(
          sessionStorage.getItem('token') || '',
          sessionStorage.getItem('email') || '',
          this.getPermissions(),
          isAdmin
        );
      }
    })
  );
}

  obtenirUnUtilisateurParEmail(email: string): Observable<any> {
    const safe = encodeURIComponent(String(email).replace(/['"]/g, '').trim());
    return this.http.get<any>(`${host}utilisateurs/${safe}`, httpOptions);
  }

  sauvegarderDansLaSession(token: string, email: string, permissions: string[] = [], isAdmin = false) {
    sessionStorage.setItem('token', token ?? '');
    sessionStorage.setItem('email', email ?? '');
    sessionStorage.setItem('permissions', JSON.stringify(permissions || []));
    sessionStorage.setItem('isAdmin', String(!!isAdmin));
  }

  deconnexion(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('permissions');
    sessionStorage.removeItem('isAdmin');
    this.router.navigate(['/']);
  }

  deconnexionPedagogie(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('permissions');
    sessionStorage.removeItem('isAdmin');
    this.router.navigate(['/connexion-pedagogie']);
  }

  obtenirLeToken(): string | null {
    this.token = sessionStorage.getItem('token') || undefined;
    return this.token ?? null;
  }

  /** ====== Password & divers ====== */
  motdepasseoublie(email: string): Observable<any> {
    return this.http.post(host + 'utilisateurs/motdepasseoublie/', email, httpOptions);
  }
  motdepasseoubliePedagogie(email: string): Observable<any> {
    return this.http.post(hostPedago + 'requerant/motdepasseoublie/', email, httpOptions);
  }

  reinitialiseLeMotDePasse(motdepasse: string, confirmationdemotdepasse: string, token: string): Observable<any> {
    return this.http.patch(
      host + `utilisateurs/reinitialisation?token=${token}`,
      { motdepasse, confirmationdemotdepasse },
      httpOptions
    );
  }

  getStatistiques(): Observable<any> {
    return this.http.get<any>(host + 'utilisateurs/statistiques', httpOptions);
  }

  getPermissionsByEmail(email: string): Observable<string[]> {
    const safe = encodeURIComponent(String(email).replace(/['"]/g, '').trim());
    return this.http.get<string[]>(`${host}utilisateurs/permissions/${safe}`, httpOptions);
  }

  toggleDoubleFacteur(utilisateurId: number) {
    return this.http.patch<any>(
      host + `utilisateurs/${utilisateurId}/double-facteur-inverser-etat`,
      {},
      httpOptionsJson
    );
  }
  toggleEtatUtilisateur(utilisateurId: number): Observable<any> {
    return this.http.patch<any>(host + `utilisateurs/${utilisateurId}/inverser-etat`, {}, httpOptions);
  }
  toggleAdmin(utilisateurId: number): Observable<any> {
    return this.http.patch<any>(host + `utilisateurs/${utilisateurId}/inverser-admin`, {}, httpOptions);
  }

  recuperationDeImageDeProfil(image_de_profil: string) {
    if (image_de_profil) {
      return this.http.get(
        host + `utilisateurs/telechargementdefichier/${image_de_profil}`,
        { responseType: 'blob' as const }
      );
    }
    return undefined;
    }

  verifierLeJeton(token: string): Observable<any> {
    return this.http.get<any>(host + `utilisateurs/verificationdujetondemotdepasse?token=${token}`);
  }

  estConnecte(): boolean {
    return !!this.obtenirLeToken();
  }

  changerDimageDeProfil(imageDeProfil: any, email: string): Observable<any> {
    return this.http.patch<any>(host + `utilisateurs/miseajourimagedeprofil/${email}`, imageDeProfil);
  }

  gestionnaireDerreur(error: HttpErrorResponse): Observable<any> {
    switch (error.status) {
      case 0:
      case 400:
        return of({ dataState: DataStateEnum.ERREUR, errorMessage: error.error?.message, errorStatus: error.status });
      case 401:
        return of({ dataState: DataStateEnum.ERREUR, errorMessage: 'Autorisation non accordée', errorStatus: error.status });
      case 405:
        return of({ dataState: DataStateEnum.ERREUR, errorMessage: "La méthode n'est pas prise en charge par le serveur.", errorStatus: error.status });
      case 409:
        this.router.navigate(['/']);
        return of({
          dataState: DataStateEnum.ERREUR,
          errorMessage: error.error?.message,
          errorStatus: error.status,
          typeErreur: error.error?.typeErreur,
          champs: error.error?.errors
        });
      case 500:
        return of({ dataState: DataStateEnum.ERREUR, errorMessage: error.error?.message, errorStatus: error.status });
      case 501:
        return of({ dataState: DataStateEnum.ERREUR, errorMessage: "La méthode d'envoie d'est pas prise en charge par le serveur.", errorStatus: error.status });
      default:
        return of({ dataState: DataStateEnum.ERREUR, errorMessage: error.error?.message, errorStatus: error.status });
    }
  }

  /** ==== Pédagogie (inchangé) ==== */
  verifierLeJetonPedago(token: string): Observable<any> {
    return this.http.get<any>(hostPedago + `requerant/verificationdujetondemotdepasse?token=${token}`);
  }
  reinitialiseLeMotDePassePedago(motdepasse: string, confirmationdemotdepasse: string, token: string): Observable<any> {
    return this.http.patch(
      hostPedago + `requerant/reinitialisation?token=${token}`,
      { motdepasse, confirmationdemotdepasse },
      httpOptions
    );
  }
  inscriptionPedago(email: string, fonction: string, nom: string, prenom: string, pays: string): Observable<any> {
    return this.http.post(hostPedago + 'requerant', { email, fonction, nom, prenom, pays }, httpOptions);
  }
  public inscriptionPedagoNew(data: any): Observable<any> {
    return this.http.post<any>(hostPedago + 'requerant/ajouter-requerant', data);
  }
  connexionPedago(email: string, motdepasse: string): Observable<any> {
    return this.http.post(hostPedago + 'requerant/connexion/', { email, motdepasse }, httpOptions);
  }
  obtenirUnUtilisateurParEmailPedagogie(email: string): Observable<any> {
    return this.http.get<any>(hostPedago + `requerant/${email}`, httpOptions);
  }
  changerDimageDeProfilPedagogie(imageDeProfil: any, email: string): Observable<any> {
    return this.http.patch<any>(hostPedago + `requerant/miseajourimagedeprofil/${email}`, imageDeProfil);
  }
  recuperationDeImageDeProfilPedago(image_de_profil: string) {
    if (image_de_profil) {
      return this.http.get(
        hostPedago + `requerant/telechargementdephotoProfil/${image_de_profil}`,
        { responseType: 'blob' as const }
      );
    }
    return undefined;
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PersonnelLite } from '../models/personnel-lite.model';

// petit util pour éviter les doubles //
const join = (base: string, path: string) =>
  `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

export type EtatCivilCreate = {
  nom: string;
  prenom: string;
  email?: string | null;
};

@Injectable({ providedIn: 'root' })
export class PersonnelsRhService {
  private http = inject(HttpClient);
  private BASE = environment.hostmicroservicepersonnel; // ex: http://localhost:9002/rh

  /** Recherche paginée sur /personnels/parNomPrenom/pages, on renvoie juste le tableau de contenus */
  search(nom: string, prenom: string, page = 0, size = 10): Observable<PersonnelLite[]> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (nom) params = params.set('nom', nom);
    if (prenom) params = params.set('prenom', prenom);

    return this.http
      .get<any>(join(this.BASE, 'personnels/parNomPrenom/pages'), { params })
      .pipe(map((p) => (p?.content ?? []) as PersonnelLite[]));
  }

  /**
   * Crée un personnel côté RH (POST /personnels/createWithEtatCivil) puis
   * refait une recherche (nom+prenom) pour récupérer l’objet (car le DTO renvoyé
   * ne contient pas l’id).
   */
  createQuick(ec: EtatCivilCreate): Observable<PersonnelLite> {
    const body = {
      nom: ec.nom,
      prenom: ec.prenom,
      email: ec.email ?? null
      // si votre EtatCivilDTO attend d'autres champs, ajoute-les ici (matricule, etc.)
    };

    return this.http
      .post<any>(join(this.BASE, 'personnels/createWithEtatCivil'), body)
      .pipe(
        switchMap(() => this.search(ec.nom, ec.prenom, 0, 1)),
        map((arr) => {
          if (!arr?.length) throw new Error('Créé mais introuvable à la recherche.');
          return arr[0];
        })
      );
  }
}

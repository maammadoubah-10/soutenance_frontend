// src/app/guards/authentification.guard.ts (ou ton chemin actuel)

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationGuard implements CanActivate {

  constructor(
    private router: Router,
    private authentificationService: AuthentificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    const estConnecte = this.authentificationService.estConnecte();

    // Pas connecté → redirection page d’accueil (inchangé)
    if (!estConnecte) {
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // À partir d’ici : utilisateur connecté
    const url = state.url || '';
    const estAdmin = this.authentificationService.isAdmin();

    // ======= LOGIQUE SPÉCIALE POUR LE MODULE RH =======
    if (url.startsWith('/rh')) {

      // 1) Un personnel essaie d’accéder au dashboard admin
      if (!estAdmin && url.includes('tableaudebord')) {
        // On le renvoie vers son propre dashboard
        return this.router.parseUrl('/rh/mon-dashboard');
      }

      // 2) Un admin essaie d’aller sur le dashboard personnel
      if (estAdmin && url.includes('mon-dashboard')) {
        return this.router.parseUrl('/rh/tableaudebord');
      }
    }

    // Comportement par défaut : accès autorisé
    return true;
  }
}

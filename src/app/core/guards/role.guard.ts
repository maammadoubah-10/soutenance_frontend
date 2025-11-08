import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  private check(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const roles: string[] = (route.data?.['roles'] as string[]) ?? [];
    if (roles.length === 0) return true; // pas de restriction
    if (this.auth.hasRole(...roles)) return true;
    // rediriger vers une page 403 ou le dashboard perso
    return this.router.parseUrl('/forbidden');
  }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    return this.check(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot): boolean | UrlTree {
    return this.check(route);
  }
}

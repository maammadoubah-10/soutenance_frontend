import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const required: string[] = route.data?.['permissions'] || [];

    // Admin = bypass
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    if (isAdmin) return true;

    let perms: string[] = [];
    try { perms = JSON.parse(sessionStorage.getItem('permissions') || '[]'); } catch {}

    const have = new Set(perms.map(p => String(p).trim().toLowerCase()));
    const need = required.map(r => r.trim().toLowerCase());
    const ok = need.every(r => have.has(r));

    // (logs debug si besoin)
    console.log('[Guard] need=', need, 'have=', Array.from(have), 'ok=', ok);

    // 👉 au lieu de retourner /espacedetravail (blanc), on envoie vers /forbidden
    return ok ? true : this.router.createUrlTree(['/forbidden']);
  }
}

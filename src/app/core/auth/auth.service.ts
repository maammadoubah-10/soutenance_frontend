import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { decodeJwt, JwtUser } from './token.util';

const TOKEN_KEY = 'token';                // tu l’utilises déjà en sessionStorage
const USER_CACHE_KEY = 'auth_user_cache'; // pour éviter de redécoder à chaque fois

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {}

  get token(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(USER_CACHE_KEY);
  }

  clear() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_CACHE_KEY);
  }

  get currentUser(): JwtUser | null {
    const cached = sessionStorage.getItem(USER_CACHE_KEY);
    if (cached) return JSON.parse(cached);

    const user = decodeJwt(this.token);
    if (user) sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    return user;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  hasRole(...roles: string[]): boolean {
    const user = this.currentUser;
    if (!user) return false;
    const set = new Set(user.roles.map(r => r.toUpperCase()));
    return roles.some(r => set.has(r.toUpperCase()));
  }

  logoutToLogin() {
    this.clear();
    this.router.navigate(['/auth/login']);
  }
}

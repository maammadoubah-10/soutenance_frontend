import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({ /* ... */ })
export class LoginComponent {
  constructor(private auth: AuthService, private router: Router, private toastr: ToastrService) {}

  onLoggedInSuccess(token: string) {
    this.auth.setToken(token);
    const user = this.auth.currentUser;

    if (!user) {
      this.toastr.error('Impossible de lire le profil.');
      return;
    }

    // Choix du tableau de bord par priorité de rôle
    const roles = new Set(user.roles.map(r => r.toUpperCase()));
    if (roles.has('ADMIN')) {
      this.router.navigate(['/admin']); // ou /admin/tableaudebord
    } else if (roles.has('RH')) {
      this.router.navigate(['/rh/tableaudebord']);
    } else if (roles.has('PERSONNEL')) {
      this.router.navigate(['/rh/tableaudebord']); // perso = RH light
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}

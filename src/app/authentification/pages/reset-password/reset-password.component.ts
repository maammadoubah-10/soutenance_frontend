import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from '../../../utilisateur/services/utilisateur.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  checking = true;
  valid = false;
  reason = '';

  motDePasse = '';
  confirmationDeMotDePasse = '';
  saving = false;
  error = '';
  done = false;

  constructor(
    private route: ActivatedRoute,
    private api: UtilisateurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.api.verifierJetonReinit(this.token).subscribe({
      next: (res: any) => {
        this.valid = !!res?.valid;
        this.checking = false;
      },
      error: (err) => {
        this.valid = false;
        this.reason = err?.error?.reason || 'Lien invalide ou expiré.';
        this.checking = false;
      }
    });
  }

  submit(): void {
    this.error = '';
    if (!this.valid) { this.error = 'Lien invalide ou expiré.'; return; }
    if (!this.motDePasse || this.motDePasse.length < 8) {
      this.error = 'Le mot de passe doit contenir au moins 8 caractères.';
      return;
    }
    if (this.motDePasse !== this.confirmationDeMotDePasse) {
      this.error = 'Les deux mots de passe ne correspondent pas.';
      return;
    }

    this.saving = true;
    this.api.reinitialiserMotDePasse(this.token, {
      motDePasse: this.motDePasse,
      confirmationDeMotDePasse: this.confirmationDeMotDePasse
    }).subscribe({
      next: () => { this.saving = false; this.done = true; },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.message || 'Échec de la réinitialisation.';
      }
    });
  }

  goLogin(): void {
    this.router.navigate(['/']); // adapte si besoin
  }
}

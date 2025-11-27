// src/app/authentification/connexion/connexion.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataStateEnum } from '../../state/state';
import { catchError } from 'rxjs/operators';

import { AuthentificationService } from '../services/authentication.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from "sweetalert2";
import { GLOBAL_CONFIG } from "../../commun/models/global";
import { AsyncPipe, CommonModule, NgIf, NgSwitch, NgSwitchCase } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilisateurService } from '../../utilisateur/services/utilisateur.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgSwitch,
    FormsModule,
    ReactiveFormsModule,
    NgSwitchCase,
    NgIf,
    RouterLink,
    NgbDropdownModule
  ],
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  public of =  GLOBAL_CONFIG.OF;
  public entreprise =  GLOBAL_CONFIG.TITRE_ESPACE_CONNEXION;
  public image_path = GLOBAL_CONFIG.IMAGE_CONNEXION;
  showPassword!: boolean;
  dataStateEnum = DataStateEnum;

  form: any = {
    email: null,
    motdepasse: null
  };

  showDoubleFactorForm = false;
  doubleFactorForm = { email: '', motdepasse: '' };
  loading = false;

  response!: Observable<any>;

  year: number = new Date().getFullYear();

  constructor(
    private authenfication: AuthentificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit() {}

  // ================== CONNEXION SIMPLE ==================
  onSubmit(): void {
    const { email, motdepasse } = this.form;
    this.loading = true;

    this.authenfication.connexion(email, motdepasse)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.authenfication.gestionnaireDerreur(error)
        )
      )
      .subscribe({
        next: (data) => {
          this.loading = false;

          // Si le gestionnaire d'erreur a renvoyé un objet d'erreur
          if (data?.dataState === DataStateEnum.ERREUR) {
            this.errormsg('Connexion échouée', data?.errorMessage || 'Erreur lors de la connexion.');
            return;
          }

          // Double facteur activé
          if (data?.doubleFacteur) {
            this.showDoubleFactorForm = true;
            this.doubleFactorForm.email = email;
            this.successmsg('Code envoyé', 'Un code de vérification a été envoyé à votre email.');
            return;
          }

          // Connexion simple réussie → on rafraîchit le profil pour calculer isAdmin correctement
          this.loading = true;
          this.authenfication.getMe().subscribe({
            next: () => {
              this.loading = false;
              this.successmsg('Connexion réussie', 'Vous êtes maintenant connecté.');

              // Ici on pourrait rediriger directement RH selon le rôle,
              // mais on garde ton comportement actuel vers /espacedetravail
              this.router.navigate(['/espacedetravail']);
            },
            error: () => {
              // Si la récupération du profil échoue, on reste sur le comportement actuel
              this.loading = false;
              this.successmsg('Connexion réussie', 'Vous êtes maintenant connecté.');
              this.router.navigate(['/espacedetravail']);
            }
          });
        },
        error: () => {
          this.loading = false;
          this.errormsg('Connexion échouée', 'Une erreur s\'est produite lors de l\'authentification.');
        }
      });
  }

  // ================== CONNEXION DOUBLE FACTEUR ==================
  onSubmitDoubleFactor(): void {
    const { email, motdepasse } = this.doubleFactorForm;
    this.loading = true;

    this.utilisateurService.connexionDoubleFacteur({ email, motdepasse })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.authenfication.gestionnaireDerreur(error)
        )
      )
      .subscribe({
        next: (data) => {
          // Si gestionnaireDerreur a renvoyé une erreur "mappée"
          if (data?.dataState === DataStateEnum.ERREUR) {
            this.loading = false;
            this.errormsg('Code incorrect', data?.errorMessage || 'Le code de vérification est incorrect.');
            return;
          }

          if (!data?.token && !data?.accessToken) {
            this.loading = false;
            this.errormsg('Erreur', 'Token de connexion manquant.');
            return;
          }

          // Stocker le token et les permissions
          const token: string = data?.token ?? data?.accessToken ?? '';
          const perms: string[] = Array.isArray(data?.permissions) ? data.permissions : [];
          const isAdmin = !!data?.isAdmin || perms.map(p => String(p).toLowerCase()).includes('admin');

          this.authenfication.sauvegarderDansLaSession(token, email, perms, isAdmin);

          // Rafraîchir le profil pour bien calculer les rôles (ADMIN_RH, etc.)
          this.authenfication.getMe().subscribe({
            next: () => {
              this.loading = false;
              this.successmsg('Connexion réussie', 'Vous êtes maintenant connecté.');
              this.router.navigate(['/espacedetravail']);
            },
            error: () => {
              this.loading = false;
              this.successmsg('Connexion réussie', 'Vous êtes maintenant connecté.');
              this.router.navigate(['/espacedetravail']);
            }
          });
        },
        error: () => {
          this.loading = false;
          this.errormsg('Code incorrect', 'Le code de vérification est incorrect.');
        }
      });
  }

  // ================== DIVERS ==================
  resetForm(): void {
    this.showDoubleFactorForm = false;
    this.doubleFactorForm = { email: '', motdepasse: '' };
    this.form = { email: '', motdepasse: '' };
  }

  showLoadingModal(): void {
    Swal.fire({
      title: 'Connexion en cours',
      html: 'Veuillez patienter...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  successmsg(title = 'Connexion réussie!', message: any) {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Connexion échouée!',  message: any) {
    Swal.fire(title, message, 'error');
  }

  getImagePath(): string {
    return GLOBAL_CONFIG.IMAGE_CONNEXION;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  protected readonly GLOBAL_CONFIG = GLOBAL_CONFIG;
}

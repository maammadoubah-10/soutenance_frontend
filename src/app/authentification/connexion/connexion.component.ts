// src/app/authentification/connexion/connexion.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataStateEnum } from '../../state/state';
import { map, catchError, startWith, tap } from 'rxjs/operators';

import { AuthentificationService } from '../services/authentication.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from "sweetalert2";
import { GLOBAL_CONFIG } from "../../commun/models/global";
import { AsyncPipe, CommonModule, NgIf, NgSwitch, NgSwitchCase } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbDropdownModule, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
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

  public of =  GLOBAL_CONFIG.OF
  public entreprise =  GLOBAL_CONFIG.TITRE_ESPACE_CONNEXION
  public image_path = GLOBAL_CONFIG.IMAGE_CONNEXION
  showPassword !: boolean;
  dataStateEnum = DataStateEnum;
  form: any = {
    email: null,
    motdepasse: null
  };

  showDoubleFactorForm = false;
  doubleFactorForm = { email: '', motdepasse: '' };
  loading = false;

  response !: Observable<any>;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private authenfication: AuthentificationService,
              private router: Router,
              private activatedRoute : ActivatedRoute,
            private utilisateurService:UtilisateurService) { }

  ngOnInit() {

  }

  // carouselOption: OwlOptions = {
  //   items: 1,
  //   loop: false,
  //   margin: 0,
  //   nav: false,
  //   dots: true,
  //   responsive: {
  //     680: {
  //       items: 1
  //     },
  //   }
  // }// src/app/authentification/connexion/connexion.component.ts
onSubmit(): void {
     const { email, motdepasse } = this.form;
    this.loading = true;

    this.authenfication.connexion(email, motdepasse)
      .pipe(catchError((error: HttpErrorResponse) => this.authenfication.gestionnaireDerreur(error)))
      .subscribe({
        next: (data) => {
          this.loading = false;
          
          if (data.doubleFacteur) {
            // Utilisateur avec double facteur activé
            this.showDoubleFactorForm = true;
            this.doubleFactorForm.email = email;
            this.successmsg('Code envoyé', 'Un code de vérification a été envoyé à votre email.');
          } else {
            // Connexion directe réussie
            this.successmsg('Connexion réussie', 'Vous êtes maintenant connecté.');
            this.router.navigate(['/espacedetravail']);
          }
        },
        error: () => {
          this.loading = false;
          this.errormsg('Connexion échouée', 'Une erreur s\'est produite lors de l\'authentification.');
        }
      });
}

// connexion.component.ts
onSubmitDoubleFactor(): void {
  const { email, motdepasse } = this.doubleFactorForm; // Seulement email et code
  this.loading = true;

  // Envoyez seulement email et code (le code remplace le mot de passe)
  this.utilisateurService.connexionDoubleFacteur({ email, motdepasse })
    .pipe(catchError((error: HttpErrorResponse) => this.authenfication.gestionnaireDerreur(error)))
    .subscribe({
      next: async (data) => {
        this.loading = false;
        if (!data?.token) {
          this.errormsg('Erreur', 'Token de connexion manquant');
          return;
        }
        
        // Stockez le token
        const token: string = data?.token ?? data?.accessToken ?? '';
        const perms: string[] = Array.isArray(data?.permissions) ? data.permissions : [];
        this.authenfication.sauvegarderDansLaSession(token, email, perms, !!data?.isAdmin || perms.includes('admin'));
        
        this.successmsg('Connexion réussie', 'Vous êtes maintenant connecté.');
        this.router.navigate(['/espacedetravail']);
      },
      error: () => {
        this.loading = false;
        this.errormsg('Code incorrect', 'Le code de vérification est incorrect.');
      }
    });
}

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

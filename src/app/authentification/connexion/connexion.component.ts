import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataStateEnum } from '../../state/state';
import { map, catchError, startWith } from 'rxjs/operators';

import { AuthentificationService } from '../services/authentication.service';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from "sweetalert2";
import {GLOBAL_CONFIG} from "../../commun/models/global";
import {AsyncPipe, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgSwitch,
    FormsModule,
    NgSwitchCase,
    NgIf,
    RouterLink,
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

  response !: Observable<any>;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private authenfication: AuthentificationService,
              private router: Router) { }

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

  this.showLoadingModal();

  this.authenfication.connexion(email, motdepasse)
    .pipe(catchError((error: HttpErrorResponse) => this.authenfication.gestionnaireDerreur(error)))
    .subscribe({
      next: (data) => {
        if (data.dataState === this.dataStateEnum.ERREUR) {
          Swal.fire('Connexion échouée', data.errorMessage, 'error');
          return;
        }
        // Le service a déjà posé token, permissions, isAdmin
        this.successmsg('Connexion réussie', 'Vous êtes maintenant connecté.');
        this.router.navigate(['/espacedetravail']); // OK
      },
      error: () => {
        this.errormsg('Connexion échouée', 'Une erreur s’est produite lors de l’authentification.');
      }
    });
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

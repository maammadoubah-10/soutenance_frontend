import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { DataStateEnum, ModelDataState } from '../../state/state';
import { UtilisateurAuthentifie } from '../../authentification/models/utilisateur-authentifie';
import { AuthentificationService } from '../../authentification/services/authentication.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  items: any[] = [];

  term: any;

 email: string | null = null;

  profilSrc :any;
  dataStateEnum = DataStateEnum;

  utilisateurAuthentifie: any;
  utilisateurAuthentifieState$?: Observable<ModelDataState<UtilisateurAuthentifie>>;


  constructor(private router: Router, private authenficationSerice: AuthentificationService, private sanitizer: DomSanitizer) {
    this.obtenirUnUtilisateurParEmail();

  }

  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    this.items = [{ label: 'Mon compte' }, { label: 'Profil', active: true }];

  }


  importFile(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    console.log("No file selected!");
    return;
  }

  if (!this.email) {
    console.error("Email non défini, impossible d’envoyer l’image");
    return;
  }

  const file = input.files[0];
  console.log(file.name);

  const formData = new FormData();
  formData.append('file', file, file.name);

  this.authenficationSerice.changerDimageDeProfil(formData, this.email).subscribe(() => {
    window.location.reload();
  });
}



  creationImage(image: Blob) {
    if (image && image.size > 0) {
      let objectURL = URL.createObjectURL(image);
      this.profilSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    } else {
      //alert("Pas de fichier");
      //this.showSpinner = false;
    }
  }


private afficherImageDeProfil(image_de_profil: string | null | undefined): void {
  if (!image_de_profil) return;

  const obs = this.authenficationSerice.recuperationDeImageDeProfil(image_de_profil);
  if (!obs) return;

  obs.subscribe({
    next: (blob: Blob) => this.creationImage(blob),
    error: () => {
      // gestion erreur
    },
  });
}




  obtenirUnUtilisateurParEmail() {
  const email = sessionStorage.getItem("email") ?? ""; 
  this.utilisateurAuthentifieState$ = this.authenficationSerice
  .obtenirUnUtilisateurParEmail(email)
  .pipe(
    map(data => {
      this.utilisateurAuthentifie = data;
      this.email = data?.email ?? null;
      this.afficherImageDeProfil(data?.image_de_profil);
      return { data, dataState: DataStateEnum.CHARGE };
    }),
    startWith({ dataState: DataStateEnum.CHARGEMENT }),
    catchError((error: HttpErrorResponse) => this.authenficationSerice.gestionnaireDerreur(error))
  );

  }

}

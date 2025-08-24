import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {catchError, map, startWith} from "rxjs/operators";
import {DataStateEnum, ModelDataState} from "../../state/state";
import {HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {UtilisateurAuthentifie} from "../../authentification/models/utilisateur-authentifie";
import {UtilisateurService} from "../services/utilisateur.service";
import {Statistique} from "../models/statistique";
import { AuthentificationService } from '../../authentification/services/authentication.service';

@Component({
  selector: 'app-tableaudebord',
  templateUrl: './tableaudebord.component.html',
  styleUrls: ['./tableaudebord.component.scss']
})
export class TableaudebordComponent implements OnInit {
  items: any[] = [];

  dataStateEnum = DataStateEnum;
  profilSrc :any;
  utilisateurAuthentifie: any;
  statistiqueTb: any;
  utilisateurAuthentifieState$?: Observable<ModelDataState<UtilisateurAuthentifie>>;
  constructor( private sanitizer: DomSanitizer,
               private utilisateurService: UtilisateurService,
               private authenficationSerice: AuthentificationService,) {}

  ngOnInit(): void {
  this.items = [
      { label: 'Utilisateurs' },
      { label: 'Tableau de bord', active: true }
    ];    this.obtenirUnUtilisateurParEmail();
    this.obtenunirStatistique()
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
    this.utilisateurAuthentifieState$ = this.authenficationSerice.obtenirUnUtilisateurParEmail('').pipe(
      map(data => {
        this.utilisateurAuthentifie = data;
        this.afficherImageDeProfil(this.utilisateurAuthentifie.image_de_profil);
       // console.log(data,'sdsfdg');
        return { data: data, dataState: DataStateEnum.CHARGE };
      }),
      startWith({ dataState: DataStateEnum.CHARGEMENT }),
      catchError((error: HttpErrorResponse) => {
        return this.authenficationSerice.gestionnaireDerreur(error);
      }),
      //catchError(error => of({ dataState: DataStateEnum.ERREUR, errorMessage: error.error.message, errorStatus: error.status })),
    );
  }

  obtenunirStatistique(){
   this.utilisateurService.afficherLesStatistiquesUtilisateurs().subscribe((response) => {
     this.statistiqueTb = response;
   });
  }

}

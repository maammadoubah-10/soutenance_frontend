// src/app/rh/service/service.component.ts
import { Component, OnInit } from '@angular/core';
import { DataStateEnum, ModelDataState } from "../../state/state";
import { BehaviorSubject, Observable, of } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { catchError, map, startWith } from "rxjs/operators";
import Swal from "sweetalert2";
import { Service } from "../models/service";
import { ServiceService } from "../services/service.service";
import Hashids from 'hashids';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  items: any[] = [];
  dataStateEnum = DataStateEnum;
  state?: DataStateEnum;
  dossiers?: Observable<ModelDataState<Service[]>>;

  listeDossierPage: Service[] = [];

  // 🔎 Recherche
  public sigle: string = '';
  public loading: boolean = false;

  // Formulaire : uniquement sigle + designation
  formulaireDossier = new FormGroup({
    id: new FormControl(),
    designation: new FormControl('', [Validators.required]),
    sigle: new FormControl('', [Validators.required]),
  });

  totalDossier: number = 0;
  currentPage: number = 0;
  dossierPerPage: number = 10;
  sort: string = "desc";
  public pages: number[] = [];
  totalPages: number = 0;

  hashids: any;
  devisSbj = new BehaviorSubject(0);

  constructor(
    private dossierService: ServiceService,
    private router: Router,
    private toastService: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.hashids = new Hashids('mysecretkey');
    this.items = [
      { label: 'Ressources Humaines' },
      { label: 'Service', active: true }
    ];
    this.chargerListeServicePage();
  }

  /* =======================
     Chargement + pagination
  ==========================*/

  chargerListeServicePage(): void {
    this.dossiers = this.dossierService
      .listerServicePage(this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeDossierPage = response.body.content;
          this.totalDossier = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return {
            dataState: this.dataStateEnum.CHARGE,
            data: this.listeDossierPage,
          };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT }),
        catchError((err) => {
          return of({ dataState: this.dataStateEnum.ERREUR, data: [] });
        })
      );
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  /* =======================
     Modal Création / Edition
  ==========================*/

  openModal(content: any, dossier: Service | undefined = undefined) {
    if (dossier) {
      // Edition
      this.formulaireDossier.reset();
      this.formulaireDossier.patchValue({
        id: dossier.id,
        designation: dossier.designation,
        sigle: dossier.sigle,
      });
    } else {
      // Création
      this.formulaireDossier.reset();
    }

    this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  creeModifierService() {
    if (!this.formulaireDossier.valid) {
      this.toastService.error('Veuillez remplir les champs obligatoires', 'Erreur');
      return;
    }

    const payload: any = {
      id: this.formulaireDossier.get('id')?.value,
      sigle: this.formulaireDossier.get('sigle')?.value,
      designation: this.formulaireDossier.get('designation')?.value,
      // ❌ plus de secretariat ni service parent dans le payload
    };

    if (payload.id) {
      // 🔁 Modification
      this.dossierService.modifierService(payload.id, payload).subscribe(
        (response) => {
          this.listeDossierPage = this.listeDossierPage.map(e => {
            if (e.id === response.id) {
              e.designation = response.designation;
              e.sigle = response.sigle;
            }
            return e;
          });
          this.modalService.dismissAll();
          this.chargerListeServicePage();
          this.router.navigate(['/rh/services/details/', this.encodeId(response.id)]);
          this.successmsg("Service modifié", "Le Service a été modifié avec succès");
          this.formulaireDossier.reset();
        },
        (error) => {
          const errors = error.error?.errors;
          if (errors?.length) {
            for (let i = 0; i < errors.length; i++) {
              const currentError = errors[i];
              this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
            }
          } else {
            this.toastService.error(error.error?.message || 'Erreur lors de la modification', 'Erreur!');
          }
        }
      );
    } else {
      // ➕ Création
      this.dossierService.creerService(payload).subscribe(
        (response) => {
          this.listeDossierPage.unshift(response);
          this.formulaireDossier.reset();
          this.modalService.dismissAll();
          this.chargerListeServicePage();
          this.successmsg();
          this.router.navigate(['/rh/services/details/', this.encodeId(response.id)]);
        },
        (error) => {
          const errors = error.error?.errors;
          if (errors?.length) {
            for (let i = 0; i < errors.length; i++) {
              const currentError = errors[i];
              this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
            }
          } else {
            this.toastService.error(error.error?.message || 'Erreur lors de la création', 'Erreur!');
          }
        }
      );
    }
  }

  /* =======================
        Utilitaires
  ==========================*/

  closeModal() {
    this.modalService.dismissAll();
  }

  successmsg(
    title = 'Service ajouté !',
    message = 'Vous venez d\'ajouter avec succès un nouveau Service !'
  ) {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message: string) {
    Swal.fire(title, message, 'error');
  }

  supprimerDossier(id: number) {
    Swal.fire({
      title: 'Êtes vous sûr ?',
      text: 'Êtes vous sûr de vouloir le supprimer. Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Supprimez le!',
      cancelButtonText: 'Non, Annuler',
    }).then((result) => {
      if (result.value) {
        this.dossierService.supprimerService(id).subscribe({
          next: () => {
            this.devisSbj.next(0);
            this.listeDossierPage = this.listeDossierPage.filter(i => i.id !== id);
            this.successmsg('Suppression réussie', 'Service supprimé');
          },
          error: (err) => {
            this.errormsg('Service non supprimé', err.error?.message || 'Erreur');
          },
        });
      }
    });
  }

  encodeId(id: number) {
    return this.hashids.encode(id);
  }

  handleClick() {
    if (!this.sigle) {
      this.chargerListeServicePage();
    } else {
      this.search();
    }
  }

  search(): void {
    this.dossiers = this.dossierService
      .rechercheServicePage(this.sigle, this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeDossierPage = response.body.content;
          if (this.listeDossierPage.length === 0) {
            this.errormsg('Erreur', 'Aucun enregistrement ne correspond à votre recherche');
            this.chargerListeServicePage();
          }
          this.totalDossier = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return {
            dataState: this.dataStateEnum.CHARGE,
            data: this.listeDossierPage
          };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT }),
        catchError(err => {
          return of({ dataState: this.dataStateEnum.ERREUR, data: [] });
        })
      );
  }

  onPageChange(event: any): void {
    this.currentPage = 0;
    this.dossierPerPage = 10;
    if (this.sigle && this.sigle.length >= 1) {
      this.search();
    } else {
      this.chargerListeServicePage();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { DataStateEnum, ModelDataState } from "../../state/state";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Service } from "../models/service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ServiceService } from "../services/service.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { catchError, map, startWith } from "rxjs/operators";
import Swal from "sweetalert2";
import { Poste } from "../models/poste";
import { PosteService } from "../services/poste.service";
import { ToastrService } from "ngx-toastr";
import Hashids from 'hashids';

@Component({
  selector: 'app-poste',
  templateUrl: './poste.component.html',
  styleUrls: ['./poste.component.scss']
})
export class PosteComponent implements OnInit {

  items: any[] = [];
  dataStateEnum = DataStateEnum
  state?: DataStateEnum
  dossiers?: Observable<ModelDataState<Poste[]>>
  listeDossierPage: Poste[] = []
  listePoste: Poste[] = []
  listeService: Service[] = []
  public designation: string= '';
  public searchValue: string = '';
  public loading: boolean = false;

  file: File | undefined

  formulaireDossier = new FormGroup({
    id: new FormControl(),
    designation: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    chefService: new FormControl('false', [Validators.required]), // "true"/"false" string -> back boolean ok
    service: new FormControl<number | null>(null, [Validators.required]),
    poste: new FormControl<number | null>(null)
  })

  totalDossier: number = 0;
  currentPage: number = 0;
  dossierPerPage: number = 10;
  sort: string = "desc";
  public pages: number[] = [];
  totalPages: number = 0;
  private hashids?: Hashids;
  devisSbj = new BehaviorSubject(0);

  constructor(
    private dossierService: PosteService,
    private toastService: ToastrService,
    private serviceService: ServiceService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.hashids = new Hashids('mysecretkey');
    this.items = [
      { label: 'Ressources Humaines' },
      { label: 'Poste', active: true }
    ];
    this.chargerListePostePage();
  }

  chargerListePostePage(): void {
    this.dossiers = this.dossierService
      .listerPostePage(this.currentPage, this.dossierPerPage, this.sort)
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
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      )
      .pipe(
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

  openModal(content: any, dossier: Poste | undefined = undefined) {
    if (dossier) {
      this.formulaireDossier.reset();
      this.formulaireDossier.patchValue({
        id: dossier.id,
        designation: dossier.designation,
        description: dossier.description,
        chefService: String(dossier.chefService),
        service: dossier.service?.id ?? null,
        poste: dossier.poste?.id ?? null
      });
    } else {
      this.formulaireDossier.reset();
      this.formulaireDossier.get('chefService')?.setValue('false');
      this.formulaireDossier.get('service')?.setValue(null);
      this.formulaireDossier.get('poste')?.setValue(null);
      this.file = undefined;
    }
    this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  creeModifierPoste() {
    if (!this.formulaireDossier.valid) {
      this.toastService.error('Veuillez remplir les champs obligatoires', 'Erreur');
      return;
    }

    const formData = new FormData();
    if (this.file) formData.append('file', this.file);

    const designation = this.formulaireDossier.get('designation')?.value || '';
    const description = this.formulaireDossier.get('description')?.value || '';
    const chefService = this.formulaireDossier.get('chefService')?.value || 'false';
    const service = this.formulaireDossier.get('service')?.value || '';
    const poste = this.formulaireDossier.get('poste')?.value || '';

    formData.append('designation', designation.toString());
    formData.append('description', description.toString());
    formData.append('chefService', chefService.toString());
    formData.append('service', service.toString());
    if (poste !== '') formData.append('poste', poste.toString());

    const id = this.formulaireDossier.get('id')?.value;

    if (id) {
      this.dossierService.modifierPoste(id, formData).subscribe(
        (response) => {
          this.listeDossierPage = this.listeDossierPage.map(e => e.id === response.id ? response : e);
          this.modalService.dismissAll();
          this.chargerListePostePage();
          this.successmsg("Poste modifié", "Le Poste a été modifié avec succès");
          this.formulaireDossier.reset();
        },
        (error) => {
          this.errormsg('Erreur', error.error?.message || 'Modification échouée');
          if (error.error?.errors) {
            for (let er of error.error.errors) {
              this.toastService.error(er.champs + " : " + er.message, 'Erreur!');
            }
          }
        }
      );
    } else {
      this.dossierService.creerPoste(formData).subscribe(
        (response:any) => {
          this.listeDossierPage.unshift(response);
          this.formulaireDossier.reset();
          this.modalService.dismissAll();
          this.chargerListePostePage();
          this.successmsg();
        },
        (error) => {
          const res = error.error || error;
          if (res?.errors) {
            for (let er of res.errors) this.toastService.error(er.champs + ": " + er.message, 'Erreur!');
          } else {
            this.toastService.error(res?.message || 'Création échouée', 'Erreur!');
          }
        }
      );
    }
  }

  uploaderFicher($event: any) {
    if ($event.target.files.length > 0) {
      this.file = $event.target.files[0];
    }
  }

  telechargerFichePoste(poste: Poste) {
    return `${this.dossierService.contextPath}/telecharger/` + poste.ficheDePoste;
  }

  showPopOnDownloadFichePoste() {
    this.successmsg(
      'Fiche Poste téléchargée',
      "La fiche de poste a été téléchargée avec succès"
    );
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  successmsg(title = 'Poste ajouté !', message = 'Vous venez d\'ajouter avec succès un nouveau Poste !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message: any) {
    Swal.fire(title, message, 'error');
  }

  supprimerDossier(id: number) {
    Swal.fire({
      title: 'Êtes vous sûr ?',
      text: 'Suppression irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, supprimez-le!',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.value) {
        this.dossierService.supprimerPoste(id).subscribe({
          next: () => {
            this.devisSbj.next(0);
            this.listeDossierPage = this.listeDossierPage.filter(i => i.id !== id);
            this.successmsg('Suppression réussie', 'Poste supprimé');
          },
          error: (err) => this.errormsg('Poste non supprimé', err.error?.message || 'Erreur'),
        });
      }
    });
  }

  encodeId(id: number) {
    return this.hashids?.encode(id);
  }

  onSearchService(sigle: string) {
    if (sigle.length >= 1) {
      this.serviceService.rechercheService(sigle).subscribe(
        (response: any) => this.listeService = response.body.content,
        () => {}
      );
    }
  }

  onSearchPoste(designation: string) {
    if (designation.length >= 3) {
      this.dossierService.recherchePoste(designation).subscribe(
        (response: any) => this.listePoste = response.body.content,
        () => {}
      );
    }
  }

  handleClick() {
    if (!this.designation) this.chargerListePostePage();
    else this.search();
  }

  search(): void {
    this.dossiers = this.dossierService.recherchePostePage(this.designation, this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeDossierPage = response.body.content;
          if (this.listeDossierPage.length === 0) {
            this.errormsg('Erreur', 'Aucun enregistrement ne correspond à votre recherche');
            this.chargerListePostePage();
          }
          this.totalDossier = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listeDossierPage };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT }),
        catchError(err => of({ dataState: this.dataStateEnum.ERREUR, data: [] }))
      );
  }

  onPageChange(event: any): void {
    this.currentPage = 0;
    this.dossierPerPage = 10;
    if (this.designation && this.designation.length >= 3) {
      this.search();
    } else if (!this.designation?.length) {
      this.chargerListePostePage();
    }
  }
}

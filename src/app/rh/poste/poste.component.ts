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
  public sigle: string = "";
  public searchValue: string = '';
  public loading: boolean = false;
  public id?: number;

  file: File | undefined
  formulaireDossier = new FormGroup({
    id: new FormControl(),
    designation: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    chefService: new FormControl('', [Validators.required]),
    estChef: new FormControl('', [Validators.required]),
    service: new FormControl<number | null>(null, [Validators.required]), // Permettre number | null
    poste: new FormControl<number | null>(null) 

  })
  totalDossier: number = 0;
  currentPage: number = 0;
  dossierPerPage: number = 10;
  sort: string = "desc";
  public pages: number[] = [];
  totalPages: number = 0;
  private hashids?: Hashids;
  devisSbj = new BehaviorSubject(0); // remove tab
  constructor(private dossierService: PosteService,
    private toastService: ToastrService,
    private serviceService: ServiceService,
    private modalService: NgbModal) { } //générer les messages
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
      this.formulaireDossier.patchValue(dossier as any);
      this.formulaireDossier.get('id')?.setValue(dossier?.id);
      this.formulaireDossier['controls'].designation.setValue(dossier?.designation?.toString());
      this.formulaireDossier['controls'].description.setValue(dossier?.description);
      ficheDePoste: dossier?.ficheDePoste //c'est le file
      chefService: dossier?.chefService
      estChef: dossier?.estChef
// ... existing code ...

this.formulaireDossier.get('service')?.setValue(dossier?.service?.id || null);
this.formulaireDossier.get('poste')?.setValue(dossier?.poste?.id || null);

// ... existing code ...
    } else {
      this.formulaireDossier.reset();
      this.formulaireDossier['controls'].service.setValue(null);
      this.formulaireDossier['controls'].poste.setValue(null)
    }
    this.modalService.open(content, {
    size: 'lg',        // ← Taille large
    backdrop: 'static', // ← Empêche la fermeture en cliquant à l'extérieur
    keyboard: false     // ← Empêche la fermeture avec la touche Échap
  });
  }


  creeModifierPoste() {
    let formData = new FormData();

    // Ajouter le fichier
    if (this.file) {
      formData.append('file', this.file);
    }

    // Récupérer les valeurs et les convertir en string (éviter null)
    const designation = this.formulaireDossier.get('designation')?.value || '';
    const description = this.formulaireDossier.get('description')?.value || '';
    const chefService = this.formulaireDossier.get('chefService')?.value || '';
    const estChef = this.formulaireDossier.get('estChef')?.value || '';
    const service = this.formulaireDossier.get('service')?.value || '';
    const poste = this.formulaireDossier.get('poste')?.value || '';

    // Ajouter les données au FormData (toujours en string)
    formData.append('designation', designation.toString());
    formData.append('description', description.toString());
    formData.append('chefService', chefService.toString());
    formData.append('estChef', estChef.toString());
    formData.append('service', service.toString());
    formData.append('poste', poste.toString());

    if (this.formulaireDossier.valid)
      if (this.formulaireDossier.get('id')?.value) {
        this.dossierService.modifierPoste(this.formulaireDossier.get("id")?.value, formData)
          .subscribe(
            (response) => {
              this.listeDossierPage.map(e => {
                if (e.id == response.id) {
                  e.designation = response.designation
                  e.description = response.description
                  e.poste = response.poste
                  e.service = response.service
                }
                return e;
              })
              this.modalService.dismissAll()
              this.chargerListePostePage()
              this.successmsg("Poste modifier", "Le Poste a été modifié avec succès")
              this.formulaireDossier.reset()
            },
            (error) => {
              this.errormsg('Erreur', error.error.message);
              for (let erreur in error.error.errors) {
                this.errormsg('Erreur', erreur + " " + error.error.errors[erreur]);
              }
            }
          )
      } else {
        this.dossierService.creerPoste(formData).subscribe(
          (response:any) => {
            this.listeDossierPage.unshift(response['data'])
            this.formulaireDossier.reset()
            this.modalService.dismissAll()
            this.chargerListePostePage()
            this.successmsg()
          },
          (error) => {
            console.log(error);
            const errors = error.errors;
            for (let i = 0; i < errors.length; i++) {
              const currentError = errors[i];
              this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
            }
          }
        )
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
      'Fiche Poste telecharger',
      "La Fiche de Poste a été bien téléchargé avec succès"
    );
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  successmsg(title = 'Poste ajouté !', message = 'Vous venez d\'ajoutez avec succès un nouveau Poste !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message: any) {
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
        this.dossierService.supprimerPoste(id).subscribe({
          next: (value) => {
            this.devisSbj.next(0);
            this.listeDossierPage = this.listeDossierPage.filter(
              (i) => i.id !== id
            );
            this.successmsg('Suppression réussie', 'Poste supprimer');
          },
          error: (err) => {
            this.errormsg('Poste non supprimer', err.error.message);
          },
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
        (response: any) => {
          this.listeService = response.body.content
        }, (error) => {
        }
      );
    }
  }

  onSearchPoste(designation: string) {
    if (designation.length >= 3) {
      this.dossierService.recherchePoste(designation).subscribe(
        (response: any) => {
          this.listePoste = response.body.content
        }, (error) => {
        }
      );
    }
  }

  handleClick() {
    if (!this.designation) {
      this.chargerListePostePage();
    } else {
      this.search()
    }
  }

  search(): void { //recherche l'element
    this.dossiers = this.dossierService.recherchePostePage(this.designation, this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeDossierPage = response.body.content;
          if (this.listeDossierPage.length === 0) {
            this.errormsg('Erreur', 'Aucun enregistrement ne correspond à votre recherche');
            this.chargerListePostePage()
          }
          this.totalDossier = response.body.totalElements;
          this.totalPages = response.body.totalPages
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listeDossierPage };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      ).pipe(
        catchError(err => {
          return of({ dataState: this.dataStateEnum.ERREUR, data: [] });
        })
      );
  }

  onPageChange(event: any): void { //actionne la recherche
    this.currentPage = 0;
    this.dossierPerPage = 10;
    if (this.designation && this.designation.length >= 3) {
      this.search();
      if (this.listeDossierPage.length === 0) {
        throw new Error('Aucun résultat trouvé pour la recherche.');
        this.errormsg('Erreur', 'Aucun résultat ne correspond à votre recherche');
      }
    } else if (!this.designation?.length) {
      this.chargerListePostePage();
    }
  }

}

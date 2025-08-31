import { Component, OnInit } from '@angular/core';
import { DataStateEnum, ModelDataState } from "../../../state/state";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Service } from "../../models/service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ServiceService } from "../../services/service.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
// @ts-ignore
import Hashids from 'hashids'
import { Poste } from "../../models/poste";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { catchError, map, startWith } from "rxjs/operators";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  items: any[] = [];
  dataStateEnum = DataStateEnum
  state?: DataStateEnum
  postes?: Observable<ModelDataState<Poste[]>>
  services?: Observable<ModelDataState<Service[]>>
  listePosteService: Poste[] = []
  listeServiceService: Service[] = []
  listeService: Service[] = []
  service$?: Observable<ModelDataState<Service | undefined>>;
  service?: Service;
  public designation: string = '';
  public sigle: string = "";
  public searchValue: string = '';
  public loading: boolean = false;
  public id: number = 0;

  formulaireDossier = new FormGroup({
    id: new FormControl(),
    designation: new FormControl('', [Validators.required]),
    sigle: new FormControl('', [Validators.required]),
    secretariat: new FormControl('', [Validators.required]),
    service: new FormControl<number | null>(null)

  })
  totalPoste: number = 0;
  totalService: number = 0;
  currentPage: number = 0;
  dossierPerPage: number = 10;
  sort: string = "desc";
  public pages: number[] = [];
  totalPages: number = 0;

  hashids: any
  private id$: any;

  devisSbj = new BehaviorSubject(0); // remove tab
  constructor(private dossierService: ServiceService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastrService,
    private router: Router,
    private modalService: NgbModal) { } //générer les messages
  ngOnInit(): void {
    this.hashids = new Hashids('mysecretkey');

    this.activatedRoute.paramMap.subscribe((params) => {
      const encodedId = params.get('id');

      if (encodedId) {  // ← Vérifier que encodedId n'est pas null
        this.id$ = this.decodeId(encodedId);
      } else {
        console.warn('ID parameter is missing');
        // Gérer le cas où l'ID est manquant
      }
    });

    this.items = [
      { label: 'Ressources Humaines' },
      { label: 'Service' },
      { label: 'Details', active: true },
    ];
    this.chargerIdService(this.id$);
  }
  decodeId(encodedId: string) {
    const [id] = this.hashids.decode(encodedId);
    return id;
  }

  chargerIdService(id: number) {
    this.activatedRoute.params.subscribe((params) => {
      this.chargeInformationService(id);
    });
  }

  chargeInformationService(id: number) {
    this.service$ = this.dossierService.voirService(id)
      .pipe(
        map((response) => {
          this.service = response;
          this.chargerListePosteParService();
          this.chargerListeServiceParService()
          return { dataState: DataStateEnum.CHARGE, data: response };
        }),
        startWith({ dataState: DataStateEnum.CHARGEMENT })
      )
      .pipe(
        catchError((err) => {
          return of({ dataState: this.dataStateEnum.CHARGE, data: undefined });
        })
      );
  }

  chargerListePosteParService() {
    this.postes = this.dossierService.listerPosteService(this.id$, this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listePosteService = response.body.content;
          this.totalPoste = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return {
            dataState: this.dataStateEnum.CHARGE,
            data: this.listePosteService,
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

  chargerListeServiceParService() {
    this.services = this.dossierService.listerServiceHierararchiePage(this.id$, this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeServiceService = response.body.content;
          this.totalService = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return {
            dataState: this.dataStateEnum.CHARGE,
            data: this.listeServiceService,
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

  openModal(content: any, dossier: Service | undefined = undefined) {
    if (dossier) {
      this.formulaireDossier.patchValue(dossier as any)
      this.formulaireDossier.get('service')?.setValue(dossier?.service?.id || null)
    } else {
      this.formulaireDossier.reset()
      this.formulaireDossier.get('service')?.setValue(null)
    }
    this.modalService.open(content)

  }

  creeModifierService() {
    if (this.formulaireDossier.valid)
      if (this.formulaireDossier.get('id')?.value) {
        this.dossierService.modifierService(this.formulaireDossier.get("id")?.value, this.formulaireDossier.value)
          .subscribe(
            (response: any) => {
              this.listeService.map(e => {
                if (e.id == response["data"].id) {
                  e.designation = response["data"].designation
                  e.sigle = response["data"].sigle
                }
                return e;
              })
              this.modalService.dismissAll()
              this.chargerIdService(this.id$)
              this.successmsg("Service modifier", "Le Service a été modifié avec succès")
              this.formulaireDossier.reset()
            },
            (error) => {
              const errors = error.error.errors;
              for (let i = 0; i < errors.length; i++) {
                const currentError = errors[i];
                this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
              }
            }
          )
      } else {
        this.dossierService.creerService(this.formulaireDossier.value).subscribe(
          (response: any) => {
            this.listeService.unshift(response['data'])
            this.formulaireDossier.reset()
            this.modalService.dismissAll()
            this.chargerIdService(this.id$)
            this.successmsg()
          },
          (error) => {
            const errors = error.error.errors;
            for (let i = 0; i < errors.length; i++) {
              const currentError = errors[i];
              this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
            }
          }
        )
      }
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  successmsg(title = 'Service ajouté !', message = 'Vous venez d\'ajoutez avec succès un nouveau Service !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message: string) {
    Swal.fire(title, message, 'error');
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


  supprimerDossier() {
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
        this.dossierService.supprimerService(this.id$).subscribe({
          next: (value) => {
            this.devisSbj.next(0);
            this.listeService = this.listeService.filter(
              (i) => i.id !== this.id$
            );
            this.router.navigate(['personnel/services']);
            this.successmsg('Suppression réussie', 'Service supprimer');
          },
          error: (err) => {
            this.errormsg('Service non supprimer', err.error.message);
          },
        });
      }
    });
  }
  encodeId(id: number) {
    return this.hashids.encode(id);
  }

  onSearchDistributaire(sigle: string) {
    if (sigle.length >= 1) {
      this.dossierService.rechercheService(sigle).subscribe(
        (response: any) => {
          this.listeService = response.body.content
        }, (error) => {
        }
      );
    }
  }
  goBack(): void {
    this.router.navigate(['rh/services']);
  }
}


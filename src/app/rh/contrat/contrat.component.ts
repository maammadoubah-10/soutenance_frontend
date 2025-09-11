import {Component, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {DataStateEnum, ModelDataState} from "../../state/state";
import {BehaviorSubject, Observable, of} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Contrat} from "../models/contrat";
// @ts-ignore
import Hashids from 'hashids'
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ContratService} from "../services/contrat.service";
import {catchError, map, startWith} from "rxjs/operators";
import Swal from "sweetalert2";
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {WizardComponent} from "angular-archwizard";
import {Personnel} from "../models/personnel";
import {PersonnelService} from "../services/personnel.service";
import { UtilisateurService } from '../../utilisateur/services/utilisateur.service';

@Component({
  selector: 'app-contrat-personnel', 
   templateUrl: './contrat.component.html',
  styleUrls: ['./contrat.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'fr' }],
})
export class ContratComponent implements OnInit {

  @ViewChild(WizardComponent)
  public wizard!: WizardComponent;

  items: any[] = [];;
  dataStateEnum = DataStateEnum
  state?: DataStateEnum
  contrat?: Contrat
  contrats?: Observable<ModelDataState<Contrat[]>>
  listeContrat: Contrat[] = []
  listeInsertionPage: Contrat[] = []
  listePersonnel: Personnel[] = []
  public searchItem: string = ""
  public designation: string = '';
  public designationPersonnel: string = '';
  public searchValue: string = '';
  public loading: boolean = false;
  public id?: number;
   public idContrat:number = 0;
  public perPage: number = 4;
  devisSbj = new BehaviorSubject(0);
  public p: number = 1;
  personnelId?: number;
   sort: string = "desc";
  pieces: File | undefined
  formulaireContrat = new FormGroup({
    id: new  FormControl(),
    personnelId: new FormControl<number | null>(null, [Validators.required]),
    dateDebutContrat: new FormControl(this.formatDate(new Date()), [Validators.required]),
    dateFinContrat: new FormControl('', [Validators.required]),
    natureContrat: new FormControl('', [Validators.required]),
    dateDebutEssaie: new FormControl(''),
    dateFinEssaie: new FormControl(''),
    dateEmbauche: new FormControl(''),
    dateAncienneteEntreprise: new FormControl(''),
    dateAncienneteProfession: new FormControl(''),
    motifDepart: new FormControl(''),
    anneeEncours: new FormControl(''),
    anneePassee: new FormControl(''),
    anneeSurpassee: new FormControl(''),
  });

  hashids: any
  totalInsertions: number = 0;
  currentPage: number = 0;
  insertionsPerPage: number = 4;
  public pages: number[] = []
  totalPages: number = 0
  public searchItemContrat: string = ""
  breadCrumbItems:  any[] = [];;
  term: string = "";
   public designationcontrat:string = '';

  selectedPersonnel: any = null;
  buttonText: string = 'Créer un Personnel';
  modalPersonnelRef: NgbModalRef | undefined;

  constructor(private contratService: ContratService,
              private router: Router,
              private personnelService: PersonnelService,
              private utilisateurService: UtilisateurService,
              private activatedRoute: ActivatedRoute,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private toastService: ToastrService) { }

  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    this.breadCrumbItems = [{ label: 'RH' }, { label: 'Contrats Personnel', active: true }];
    this.hashids = new Hashids('mysecretkey');
    this.items = [
      { label: 'Ressources Humaines' },
      { label: 'Contrats Personnel', active: true },
    ];
    this.getContrats();

     this.utilisateurService.personnelNonUtilisateur().subscribe(x => {
      this.listePersonnel = x;
    });
  }

  getContrats(): void {
  this.contrats = this.contratService.listerContratPage(this.currentPage, this.insertionsPerPage, this.sort)
    .pipe(
      map((data: any) => {
        // La réponse semble avoir cette structure:
        // data.body.content = tableau des contrats
        // data.body.totalElements = nombre total
        // data.body.totalPages = nombre total de pages
        this.listeContrat = data.body.content;
        this.totalInsertions = data.body.totalElements;
        this.totalPages = data.body.totalPages;
        
        this.pages = this.getPages();
        return { dataState: this.dataStateEnum.CHARGE, data: this.listeContrat };
      }),
      startWith({ dataState: this.dataStateEnum.CHARGEMENT })
    ).pipe(
      catchError(err => {
        console.error('Erreur lors du chargement des contrats:', err);
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

   onPageChange(event: any): void {
    this.currentPage = 0;
    this.insertionsPerPage = 4;
    if (this.designationcontrat && this.designationcontrat.length >= 3) {
      if (this.listeContrat.length === 0) {
        throw new Error('Aucun résultat trouvé pour la recherche.');
        this.errormsg('Erreur', 'Aucun résultat ne correspond à votre recherche');
        this.toastService.error('Aucun résultat ne correspond à votre recherche', 'Erreur');      }
    } else if (!this.designationcontrat.length) {
      this.getContrats();
    }
  }

   onSearchPersonnel(nom: string){
    if(nom.length >= 3){
      this.personnelService.recherchePersonnel(nom).subscribe(
        (response : any) => {
          this.listePersonnel = response.body.content
        },(error)=>{
        }
      );
    }
  }

  encodeId(id: number) {
    return this.hashids.encode(id);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  successmsg(title = 'Contrat ajouté !', message = 'Vous venez d\'ajouter avec succès un nouveau contrat !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message : any) {
    Swal.fire(title, message, 'error');
  }

  openModal(content: any, contrat: Contrat | undefined = undefined) {
    if (contrat) {
      this.formulaireContrat.patchValue({
        id: contrat.id,
        personnelId: contrat.personnel?.id,
        dateDebutContrat: contrat.dateDebutContrat.toString(),
        dateFinContrat: contrat.dateFinContrat.toString(),
        natureContrat: contrat.natureContrat,
        dateDebutEssaie: contrat.dateDebutEssaie.toString(),
        dateFinEssaie: contrat.dateFinEssaie.toString(),
        dateEmbauche: contrat.dateEmbauche.toString(),
        dateAncienneteEntreprise: contrat.dateAncienneteEntreprise.toString(),
        dateAncienneteProfession: contrat.dateAncienneteProfession.toString(),
        motifDepart: contrat.motifDepart,
        anneeEncours: contrat.anneeEncours.toString(),
        anneePassee: contrat.anneePassee.toString(),
        anneeSurpassee: contrat.anneeSurpassee.toString(),
      });
    } else {
      this.formulaireContrat.reset();
    }
      
    this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  creerModifierContrat() {
    if (this.formulaireContrat.valid) {
      if (this.formulaireContrat.get('id')?.value) {
        this.modifierContrat();
      } else {
        this.creerContrat();
      }
    } else {
      this.toastService.error('Veuillez remplir tous les champs obligatoires', 'Erreur');
    }
  }

  private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
  }

  // 
  
  creerContrat() {
  // Récupérer directement l'ID du formulaire
  const personnelId = this.formulaireContrat.get('personnelId')?.value;
  
  // Vérifier que personnelId est défini
  if (personnelId === null || personnelId === undefined) {
    this.toastService.error('Veuillez sélectionner un personnel', 'Erreur');
    return;
  }

  const formData = new FormData();
  
  // Ajouter tous les champs du formulaire
  Object.keys(this.formulaireContrat.controls).forEach(key => {
    if (key !== 'personnelId') {
      const value = this.formulaireContrat.get(key)?.value;
      if (value !== null && value !== undefined) {
        // Pour les dates, formater correctement
        if (value instanceof Date) {
          formData.append(key, value.toISOString().split('T')[0]);
        } else {
          formData.append(key, value.toString());
        }
      }
    }
  });

  // Ajouter le fichier
  if (this.pieces) {
    formData.append('pieces', this.pieces);
  }

  this.contratService.creerContrat(personnelId, formData)
    .subscribe(
      (response) => {
        this.listeContrat.unshift(response['data']);
        this.formulaireContrat.reset();
        this.modalService.dismissAll();
        this.toastService.success('Contrat créé avec succès', 'Succès');
        this.getContrats(); // Recharger la liste
        this.successmsg("Contrat créé", "Le contrat a été créé avec succès");
      },
      (error) => {
        console.error('Erreur détaillée:', error);
        this.toastService.error(
          error.error?.message || 'Erreur lors de la création du contrat', 
          'Erreur'
        );
        if (error.error?.errors) {
          for (let erreur in error.error.errors) {
            this.toastService.error(error.error.errors[erreur], 'Erreur');
          }
        }
      }
    );
}

  modifierContrat() {
    const contratId = this.formulaireContrat.get('id')?.value;
    const formData = new FormData();
    
    // Ajouter tous les champs du formulaire
    Object.keys(this.formulaireContrat.controls).forEach(key => {
      const value = this.formulaireContrat.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Ajouter le fichier si présent
    if (this.pieces) {
      formData.append('pieces', this.pieces);
    }

    this.contratService.modifierContrat(contratId, formData).subscribe(
      (response:any) => {
        this.listeContrat = this.listeContrat.map(i => i.id !== response.data?.id ? i : response.data);
        this.modalService.dismissAll();
        this.successmsg("Contrat modifié", "Le contrat a été modifié avec succès");
      },
      (error) => {
        this.toastService.error(error.error.message, 'Erreur');
      }
    );
  }

  uploaderFicher($event: any) {
    if ($event.target.files.length > 0) {
      this.pieces = $event.target.files[0];
    }
  }

  supprimerContrat(id: number) {
    Swal.fire({
      title: 'Êtes vous sûr ?',
      text: 'Êtes vous sûr de vouloir supprimer ce contrat ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Supprimez le!',
      cancelButtonText: 'Non, Annuler',
    }).then((result) => {
      if (result.value) {
        this.contratService.supprimerContrat(id).subscribe({
          next: (value) => {
            this.listeContrat = this.listeContrat.filter((i) => i.id !== id);
            this.toastService.success('Suppression réussie', 'Contrat supprimé');
          },
          error: (err) => {
            this.toastService.error(err.error.message, 'Contrat non supprimé');
          },
        });
      }
    });
  }

    telechargerContrat(conge:Contrat) {
      this.idContrat = conge.id ?? 0;
      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Êtes-vous sûr de vouloir télécharger le fichier du contrat ? Il vous sera impossible de revenir en arrière !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Oui, Télécharger le !',
        cancelButtonText:  'Non, Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          this.onDownloadTitreContrat();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // handle cancel action if necessary
        }
      }).catch((errors) => {
        this.toastService.error(errors.message, 'Titre de congé non télécharger');
        this.errormsg('Titre de congé non télécharger', errors.message);
      });
    }
  
  
    onDownloadTitreContrat(): void {
      this.contratService.telechargerFichierContrat(this.idContrat).subscribe(
        (data) => {
          const currentDate = new Date();
          const fileName = `titre_de_conge_${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}_${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}.pdf`;
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.click();
          this.successmsg('Générer le contrat réussie', 'Le titre de cet  congé a été générer et télécharger avec succès');
        },
        (error) => {
          const errors = error.error.errors;
          for (let i = 0; i < errors.length; i++) {
            const currentError = errors[i];
            this.toastService.error(currentError.champs + ': ' + currentError.message, 'Erreur!');
          }
        }
      );
    }
}
import { Component, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { DataStateEnum, ModelDataState } from "../../state/state";
import { BehaviorSubject, Observable, of } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Contrat } from "../models/contrat";
// @ts-ignore
import Hashids from 'hashids';
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ContratService } from "../services/contrat.service";
import { catchError, map, startWith } from "rxjs/operators";
import Swal from "sweetalert2";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { WizardComponent } from "angular-archwizard";
import { Personnel } from "../models/personnel";
import { PersonnelService } from "../services/personnel.service";
import { UtilisateurService } from '../../utilisateur/services/utilisateur.service';

@Component({
  selector: 'app-contrat-personnel',
  templateUrl: './contrat.component.html',
  styleUrls: ['./contrat.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
})
export class ContratComponent implements OnInit {

  @ViewChild(WizardComponent)
  public wizard!: WizardComponent;

  items: any[] = [];
  dataStateEnum = DataStateEnum;
  state?: DataStateEnum;
  contrat?: Contrat;
  contrats?: Observable<ModelDataState<Contrat[]>>;
  listeContrat: Contrat[] = [];
  listeInsertionPage: Contrat[] = [];
  listePersonnel: (Personnel & { _displayName?: string })[] = [];

  public searchItem: string = "";
  public designation: string = '';
  public designationPersonnel: string = ''; // 🔎 recherche front
  public searchValue: string = '';
  public loading: boolean = false;
  public id?: number;
  public idContrat: number = 0;
  public perPage: number = 4;
  devisSbj = new BehaviorSubject(0);
  public p: number = 1;
  personnelId?: number;
  sort: string = "desc";
  pieces: File | undefined;

  // 🔹 Filtre statut (front only)
  filterStatut: 'tous' | 'actifs' | 'expires' | 'avenir' = 'tous';

  formulaireContrat = new FormGroup({
    id: new FormControl(),
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

  hashids: any;
  totalInsertions: number = 0;
  currentPage: number = 0;
  insertionsPerPage: number = 4;
  public pages: number[] = [];
  totalPages: number = 0;
  public searchItemContrat: string = "";
  breadCrumbItems: any[] = [];
  term: string = "";
  public designationcontrat: string = '';

  selectedPersonnel: any = null;
  buttonText: string = 'Créer un Personnel';
  modalPersonnelRef: NgbModalRef | undefined;

  constructor(
    private contratService: ContratService,
    private router: Router,
    private personnelService: PersonnelService,
    private utilisateurService: UtilisateurService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    this.breadCrumbItems = [{ label: 'RH' }, { label: 'Contrats Personnel', active: true }];
    this.hashids = new Hashids('mysecretkey');
    this.items = [
      { label: 'Ressources Humaines' },
      { label: 'Contrats Personnel', active: true },
    ];
    this.getContrats();

    this.utilisateurService.personnelNonUtilisateur().subscribe((x: any[]) => {
      this.listePersonnel = (x || []).map((p: any) => ({
        ...p,
        _displayName: this.buildDisplayName(p),
      }));
    });
  }

  /** -------- Helpers Noms -------- */
  private buildDisplayName(p: any): string {
    // Si l'API expose fullName, priorité à cela
    const fullApi = (p?.fullName || '').trim();
    if (fullApi) return fullApi;

    const prenom = (p?.etatCivil?.prenom ?? p?.prenom ?? '').trim();
    const nom    = (p?.etatCivil?.nom    ?? p?.nom    ?? '').trim();

    const full = `${prenom} ${nom}`.trim();
    return full || 'Inconnu';
  }

  displayName(p: any): string {
    return this.buildDisplayName(p);
  }

  /** -------- Data -------- */
  getContrats(): void {
    this.contrats = this.contratService.listerContratPage(this.currentPage, this.insertionsPerPage, this.sort)
      .pipe(
        map((data: any) => {
          this.listeContrat = data.body.content || [];
          this.totalInsertions = data.body.totalElements ?? this.listeContrat.length;
          this.totalPages = data.body.totalPages ?? 1;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listeContrat };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT }),
        catchError(err => {
          console.error('Erreur lors du chargement des contrats:', err);
          return of({ dataState: this.dataStateEnum.ERREUR, data: [] });
        })
      );
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) pages.push(i);
    return pages;
  }

  onPageChange(_: any): void {
    this.currentPage = 0;
    this.insertionsPerPage = 4;
    if (this.designationcontrat && this.designationcontrat.length >= 3) {
      if (this.listeContrat.length === 0) {
        this.errormsg('Erreur', 'Aucun résultat ne correspond à votre recherche');
        this.toastr.error('Aucun résultat ne correspond à votre recherche', 'Erreur');
      }
    } else if (!this.designationcontrat.length) {
      this.getContrats();
    }
  }

  onSearchPersonnel(nom: string) {
    if (nom.length >= 3) {
      this.personnelService.recherchePersonnel(nom).subscribe(
        (response: any) => {
          this.listePersonnel = (response.body.content || []).map((p: any) => ({
            ...p,
            _displayName: this.buildDisplayName(p),
          }));
        },
        () => { /* ignore */ }
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

  errormsg(title = 'Erreur !', message: any) {
    Swal.fire(title, message, 'error');
  }

  private safeDateToInput(dateLike: any): string {
    if (!dateLike) return '';
    const d = new Date(dateLike);
    if (isNaN(d.getTime())) return '';
    return this.formatDate(d);
  }

  /** ---------- UX / Statut contrat & filtrage front ---------- */

  /** Renvoie la liste filtrée pour l'UI (recherche + statut) */
  get filteredContrats(): Contrat[] {
    let list = this.listeContrat || [];

    const search = (this.designationPersonnel || '').toLowerCase().trim();
    if (search) {
      list = list.filter((c: any) => {
        const nature = (c?.natureContrat || '').toLowerCase();
        const nomPers = this.displayName(c?.personnel || {}).toLowerCase();
        return nature.includes(search) || nomPers.includes(search);
      });
    }

    if (this.filterStatut !== 'tous') {
      list = list.filter(c => this.getStatusKey(c) === this.filterStatut);
    }

    return list;
  }

  private parseDate(dateLike: any): Date | null {
    if (!dateLike) return null;
    const d = new Date(dateLike);
    return isNaN(d.getTime()) ? null : d;
  }

  /** actif | expires | avenir | inconnu */
  private getStatusKey(c: Contrat): 'actifs' | 'expires' | 'avenir' | 'tous' | 'inconnu' {
    const debut = this.parseDate((c as any).dateDebutContrat);
    const fin   = this.parseDate((c as any).dateFinContrat);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (!debut && !fin) return 'inconnu';

    if (debut && debut > today) {
      return 'avenir';
    }

    if (fin && fin < today) {
      return 'expires';
    }

    return 'actifs';
  }

  statusLabel(c: Contrat): string {
    switch (this.getStatusKey(c)) {
      case 'actifs':  return 'Contrat actif';
      case 'expires': return 'Contrat expiré';
      case 'avenir':  return 'Contrat à venir';
      default:        return 'Statut non défini';
    }
  }

  statusBadgeClass(c: Contrat): string {
    switch (this.getStatusKey(c)) {
      case 'actifs':  return 'bg-success';
      case 'expires': return 'bg-danger';
      case 'avenir':  return 'bg-warning text-dark';
      default:        return 'bg-secondary';
    }
  }

  statusHint(c: Contrat): string {
    const today = new Date();
    today.setHours(0,0,0,0);
    const fin = this.parseDate((c as any).dateFinContrat);
    const debut = this.parseDate((c as any).dateDebutContrat);

    const key = this.getStatusKey(c);

    if (key === 'avenir' && debut) {
      const diff = Math.round((debut.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? `Commence dans ${diff} jour(s)` : '';
    }

    if (key === 'actifs' && fin) {
      const diff = Math.round((fin.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 0) {
        return `Expire dans ${diff} jour(s)`;
      } else if (diff === 0) {
        return `Expire aujourd'hui`;
      }
    }

    if (key === 'expires' && fin) {
      const diff = Math.round((today.getTime() - fin.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? `Expiré il y a ${diff} jour(s)` : 'Contrat expiré';
    }

    return '';
  }

  /** -------- Création / MAJ -------- */
  openModal(content: any, contrat: Contrat | undefined = undefined) {
    if (contrat) {
      this.formulaireContrat.patchValue({
        id: contrat.id,
        personnelId: contrat.personnel?.id ?? null,
        dateDebutContrat: this.safeDateToInput((contrat as any).dateDebutContrat),
        dateFinContrat: this.safeDateToInput((contrat as any).dateFinContrat),
        natureContrat: contrat.natureContrat ?? '',
        dateDebutEssaie: this.safeDateToInput((contrat as any).dateDebutEssaie),
        dateFinEssaie: this.safeDateToInput((contrat as any).dateFinEssaie),
        dateEmbauche: this.safeDateToInput((contrat as any).dateEmbauche),
        dateAncienneteEntreprise: this.safeDateToInput((contrat as any).dateAncienneteEntreprise),
        dateAncienneteProfession: this.safeDateToInput((contrat as any).dateAncienneteProfession),
        motifDepart: contrat.motifDepart ?? '',
        anneeEncours: ((contrat as any).anneeEncours ?? '').toString(),
        anneePassee: ((contrat as any).anneePassee ?? '').toString(),
        anneeSurpassee: ((contrat as any).anneeSurpassee ?? '').toString(),
      });
    } else {
      this.formulaireContrat.reset({
        id: null,
        personnelId: null,
        dateDebutContrat: this.formatDate(new Date()),
        dateFinContrat: '',
        natureContrat: '',
        dateDebutEssaie: '',
        dateFinEssaie: '',
        dateEmbauche: '',
        dateAncienneteEntreprise: '',
        dateAncienneteProfession: '',
        motifDepart: '',
        anneeEncours: '',
        anneePassee: '',
        anneeSurpassee: '',
      });
    }

    this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  creerModifierContrat() {
    this.formulaireContrat.markAllAsTouched();
    if (this.formulaireContrat.valid) {
      if (this.formulaireContrat.get('id')?.value) {
        this.modifierContrat();
      } else {
        this.creerContrat();
      }
    } else {
      this.toastr.error('Veuillez remplir tous les champs obligatoires', 'Erreur');
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  private isEmpty(v: any): boolean {
    return v === null || v === undefined || (typeof v === 'string' && v.trim() === '');
  }

  private appendIfNotEmpty(fd: FormData, key: string, value: any) {
    if (this.isEmpty(value)) return;

    const numericKeys = ['anneeEncours', 'anneePassee', 'anneeSurpassee'];
    if (numericKeys.includes(key)) {
      if (!isNaN(Number(value))) {
        fd.append(key, String(Number(value)));
      }
      return;
    }

    fd.append(key, String(value));
  }

  creerContrat() {
    const personnelId = this.formulaireContrat.get('personnelId')?.value;
    if (personnelId === null || personnelId === undefined) {
      this.toastr.error('Veuillez sélectionner un personnel', 'Erreur');
      return;
    }

    const formData = new FormData();
    Object.keys(this.formulaireContrat.controls).forEach(key => {
      if (key === 'personnelId') return; // envoyé via l'URL
      const value = this.formulaireContrat.get(key as any)?.value;
      this.appendIfNotEmpty(formData, key, value);
    });

    if (this.pieces) formData.append('pieces', this.pieces);

    this.contratService.creerContrat(personnelId, formData).subscribe(
      () => {
        this.formulaireContrat.reset();
        this.modalService.dismissAll();
        this.toastr.success('Contrat créé avec succès', 'Succès');
        this.getContrats();
        this.successmsg("Contrat créé", "Le contrat a été créé avec succès");
      },
      (error) => {
        console.error('Erreur détaillée:', error);
        this.toastr.error(error.error?.message || 'Erreur lors de la création du contrat', 'Erreur');
      }
    );
  }

  modifierContrat() {
    const contratId = this.formulaireContrat.get('id')?.value;
    const formData = new FormData();

    Object.keys(this.formulaireContrat.controls).forEach(key => {
      const value = this.formulaireContrat.get(key as any)?.value;
      this.appendIfNotEmpty(formData, key, value);
    });

    if (this.pieces) formData.append('pieces', this.pieces);

    this.contratService.modifierContrat(contratId, formData).subscribe(
      () => {
        this.modalService.dismissAll();
        this.successmsg("Contrat modifié", "Le contrat a été modifié avec succès");
        this.getContrats();
      },
      (error) => {
        this.toastr.error(error.error?.message || 'Erreur lors de la modification', 'Erreur');
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
          next: () => {
            this.listeContrat = this.listeContrat.filter((i) => i.id !== id);
            this.toastr.success('Suppression réussie', 'Contrat supprimé');
          },
          error: (err) => {
            this.toastr.error(err.error?.message || 'Contrat non supprimé', 'Erreur');
          },
        });
      }
    });
  }

  telechargerContrat(conge: Contrat) {
    this.idContrat = conge.id ?? 0;
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Télécharger le fichier du contrat ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Télécharger !',
      cancelButtonText: 'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onDownloadTitreContrat();
      }
    }).catch((errors) => {
      this.toastr.error(errors.message, 'Téléchargement annulé');
      this.errormsg('Téléchargement annulé', errors.message);
    });
  }

  onDownloadTitreContrat(): void {
    this.contratService.telechargerFichierContrat(this.idContrat).subscribe(
      (data) => {
        const currentDate = new Date();
        const fileName = `contrat_${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}_${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}.pdf`;
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        this.successmsg('Téléchargement réussi', 'Contrat téléchargé avec succès');
      },
      (error) => {
        const errors = error.error?.errors;
        if (errors && errors.length) {
          for (let i = 0; i < errors.length; i++) {
            const currentError = errors[i];
            this.toastr.error(currentError.champs + ': ' + currentError.message, 'Erreur!');
          }
        } else {
          this.toastr.error('Téléchargement impossible', 'Erreur');
        }
      }
    );
  }
}

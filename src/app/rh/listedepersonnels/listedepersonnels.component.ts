import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// @ts-ignore
import Hashids from 'hashids';
import { catchError, map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { StatutPersonnel } from '../models/statut-personnel';
import { DataStateEnum, ModelDataState } from '../../state/state';
import { civilite, Personnel, situationMatrimoniale } from '../models/personnel';
import { Poste } from '../models/poste';
import { Service } from '../models/service';
import { Entites } from '../models/entites';
import { Indice } from '../models/indice';

import { PersonnelService } from '../services/personnel.service';
import { PosteService } from '../services/poste.service';
import { IndiceService } from '../services/indice.service';
import { StatutPersonnelService } from '../services/statut-personnel.service';
import { EntitesService } from '../services/entites.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-listedepersonnels',
  templateUrl: './listedepersonnels.component.html',
  styleUrls: ['./listedepersonnels.component.scss'],
})
export class ListedepersonnelsComponent implements OnInit {
  items: any[] = [];
  dataStateEnum = DataStateEnum;

  dossiers?: Observable<ModelDataState<Personnel[]>>;
  listeDossierPage: Personnel[] = [];

  listePoste: Poste[] = [];
  listeService: Service[] = [];
  listeEntite: Entites[] = [];
  listeIndice: Indice[] = [];
  listeStatutPersonnel: StatutPersonnel[] = [];

  public typeCivilites = Object.values(civilite);
  public situationMatrimoniales = Object.values(situationMatrimoniale);

  PHONE_REGEX = /^[+]?[(]?[0-9]{1,6}[)]?[-\s.]?[0-9]{3,6}[-\s.]?[0-9]{3,6}$/;

  public nom = '';
  public matricule = '';
  public prenom = '';
  public loading = false;

  formulaireDossier!: FormGroup;

  totalDossier = 0;
  currentPage = 0;
  dossierPerPage = 8;
  sort = 'desc';
  public pages: number[] = [];
  totalPages = 0;

  hashids: any;
  devisSbj = new BehaviorSubject(0);

  constructor(
    private dossierService: PersonnelService,
    private posteService: PosteService,
    private router: Router,
    private entiteService: EntitesService,
    private toastService: ToastrService,
    private indiceService: IndiceService,
    private formBuilder: FormBuilder,
    private statutPersonnelService: StatutPersonnelService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.hashids = new Hashids('mysecretkey');

    this.items = [
      { label: 'Ressources Humaines' },
      { label: 'Liste du personnel', active: true },
    ];

    // ✅ Formulaire SANS groupe bancaire / paiement
   //
   this.formulaireDossier = new FormGroup({
  id: new FormControl<number | null>(null),

  identitePersonnelGroupe: this.formBuilder.group({
    matricule: new FormControl('', [Validators.required]),
    nom: new FormControl('', [Validators.required]),
    prenom: new FormControl('', [Validators.required]),
    // ✅ nouveau
    email: new FormControl('', [Validators.email]),

    civilite: new FormControl<string | null>(null, [Validators.required]),
    dateDeNaissance: new FormControl('', [Validators.required]),
    referenceComptable: new FormControl(''),
    situationMatrimoniale: new FormControl<string | null>(null, [Validators.required]),
    statutPersonnel: new FormControl<string | number | null>(null),
    nombreEnfant: new FormControl('', [Validators.required]),
    pieceIdentite: new FormControl('', [Validators.required]),
    numeroCnss: new FormControl('', [Validators.required]),
    telephone: new FormControl('', [Validators.pattern(this.PHONE_REGEX)]),
    dateEmbauchage: new FormControl('', [Validators.required]),
    adresse: new FormControl('', [Validators.required]),
  }),

  personneContacterGroupe: this.formBuilder.group({
    telephoneContact: new FormControl('', [Validators.pattern(this.PHONE_REGEX)]),
    prenomContact: new FormControl(''),
    nomContact: new FormControl(''),
  }),

  autrePersonnelGroupe: this.formBuilder.group({
    poste: new FormControl<string | number | null>(null, [Validators.required]),
    entite: new FormControl<string | number | null>(null),
    indice: new FormControl<string | number | null>(null),
  }),
});



    this.chargerListePersonnelPage();
  }

  private normalizeSearchTerm(ev: any): string {
    if (typeof ev === 'string') return ev;
    if (ev && typeof ev.term === 'string') return ev.term;
    return '';
  }
  private canSearch(term?: string, minLen = 3) {
    return !!term && term.trim().length >= minLen;
  }

  private stripEmpty<T extends Record<string, any>>(obj: T): T {
    const out: any = {};
    Object.keys(obj).forEach((k) => {
      const v = (obj as any)[k];
      if (v !== null && v !== undefined && v !== '') out[k] = v;
    });
    return out;
  }

  get formPersonnel() {
    return this.formulaireDossier.controls as any;
  }
  ctrl(path: string): AbstractControl | null {
    return this.formulaireDossier.get(path);
  }

  // --- Recherches utiles (poste / entité / indice / statut) ---
  onSearchPoste(ev: any) {
    const designation = this.normalizeSearchTerm(ev);
    if (this.canSearch(designation)) {
      this.posteService.recherchePoste(designation.trim()).subscribe(
        (response: any) =>
          (this.listePoste = response?.body?.content ?? []),
        (_) => (this.listePoste = [])
      );
    } else {
      this.listePoste = [];
    }
  }

  onSearchEntite(designation: string) {
  // Hot-fix: backend absent → on ne cherche pas
  this.listeEntite = [];
  return;
}

  onSearchIndice(ev: any) {
    const nom = this.normalizeSearchTerm(ev);
    if (this.canSearch(nom)) {
      this.indiceService.rechercheIndice(nom.trim()).subscribe(
        (response: any) =>
          (this.listeIndice = response?.body?.content ?? []),
        (_) => (this.listeIndice = [])
      );
    } else {
      this.listeIndice = [];
    }
  }
onSearchStatutPersonnel(designation: string) {
  // Hot-fix: backend absent → on ne cherche pas
  this.listeStatutPersonnel = [];
  return;
}

  onNext(stepper: MatStepper): void {
    stepper.next();
  }


  // Dans ListedepersonnelsComponent
private normalizeRow(x: any): Personnel {
  return {
    ...x,
    nom: x?.nom ?? x?.etatCivil?.nom ?? '',
    prenom: x?.prenom ?? x?.etatCivil?.prenom ?? '',
    matricule: x?.etatCivil?.matricule ?? x?.matricule ?? '',
    // <- l'adresse vient de Coordonnee (backend)
    adresse: x?.coordonnee?.adresse ?? x?.adresseSecondaire ?? '',
    poste: x?.poste ?? x?.posteGeneral ?? x?.poste?.posteGeneral ?? null,
  };
}


private normalizePageResponse(response: any): Personnel[] {
  const content = response?.body?.content ?? [];
  return content.map((x: any) => this.normalizeRow(x));
}

  // --- Liste + pagination ---
  chargerListePersonnelPage(): void {
    this.dossiers = this.dossierService
      .listerPersonnelPage(this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
  this.listeDossierPage = this.normalizePageResponse(response);
  this.totalDossier = response?.body?.totalElements ?? 0;
  this.totalPages = response?.body?.totalPages ?? 0;
  this.pages = this.getPages();
  return { dataState: this.dataStateEnum.CHARGE, data: this.listeDossierPage };
}),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT }),
        catchError(() =>
          of({ dataState: this.dataStateEnum.ERREUR, data: [] })
        )
      );
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  successmsg(
    title = 'Personnel ajouté !',
    message = 'Vous venez d’ajouter un nouveau personnel avec succès !'
  ) {
    Swal.fire(title, message, 'success');
  }
  errormsg(title = 'Erreur !', message: string) {
    Swal.fire(title, message, 'error');
  }

  handleClick() {
    if (!this.nom && !this.matricule && !this.prenom) this.chargerListePersonnelPage();
    else if (this.nom) this.searchNom();
    else if (this.prenom) this.searchPrenom();
    else if (this.matricule) this.searchMatricule();
  }

  searchNom(): void {
    this.dossiers = this.dossierService
      .recherchePersonnelNomPage(this.nom, this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
       map((response: any) => {
  this.listeDossierPage = this.normalizePageResponse(response);
  this.totalDossier = response?.body?.totalElements ?? 0;
  this.totalPages = response?.body?.totalPages ?? 0;
  this.pages = this.getPages();
  return { dataState: this.dataStateEnum.CHARGE, data: this.listeDossierPage };
}),

        startWith({ dataState: this.dataStateEnum.CHARGEMENT }),
        catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] }))
      );
  }

  onPageChangenom(_: any): void {
    this.currentPage = 0;
    this.dossierPerPage = 8;
    if (this.nom && this.nom.length >= 3) this.searchNom();
    else if (!this.nom?.length) this.chargerListePersonnelPage();
  }

  searchPrenom(): void {
    this.dossiers = this.dossierService
      .recherchePersonnelPrenom(this.prenom, this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeDossierPage = response?.body?.content ?? [];
          if (!this.listeDossierPage.length) {
            this.errormsg('Erreur', 'Aucun enregistrement ne correspond à votre recherche');
            this.chargerListePersonnelPage();
          }
          this.totalDossier = response?.body?.totalElements ?? 0;
          this.totalPages = response?.body?.totalPages ?? 0;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listeDossierPage };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT }),
        catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] }))
      );
  }

  onPageChangePrenom(_: any): void {
    this.currentPage = 0;
    this.dossierPerPage = 8;
    if (this.prenom && this.prenom.length >= 3) this.searchPrenom();
    else if (!this.prenom?.length) this.chargerListePersonnelPage();
  }

  searchMatricule(): void {
    this.dossiers = this.dossierService
      .recherchePersonnelMatricule(this.matricule, this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeDossierPage = response?.body?.content ?? [];
          if (!this.listeDossierPage.length) {
            this.errormsg('Erreur', 'Aucun enregistrement ne correspond à votre recherche');
            this.chargerListePersonnelPage();
          }
          this.totalDossier = response?.body?.totalElements ?? 0;
          this.totalPages = response?.body?.totalPages ?? 0;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listeDossierPage };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT }),
        catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] }))
      );
  }

  onPageChangeMatricule(_: any): void {
    this.currentPage = 0;
    this.dossierPerPage = 8;
    if (this.matricule && this.matricule.length >= 3) this.searchMatricule();
    else if (!this.matricule?.length) this.chargerListePersonnelPage();
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) pages.push(i);
    return pages;
  }

  encodeId(id: number) {
    return this.hashids.encode(id);
  }

  openModal(content: any, dossier: Personnel | undefined = undefined) {
  if (dossier) {
    this.formulaireDossier.patchValue({
      id: dossier.id,
      identitePersonnelGroupe: {
        matricule: dossier?.matricule ?? dossier?.etatCivil?.matricule ?? '',
        nom: dossier?.nom ?? dossier?.etatCivil?.nom ?? '',
        prenom: dossier?.prenom ?? dossier?.etatCivil?.prenom ?? '',
        civilite: dossier?.civilite ?? dossier?.etatCivil?.civilite ?? null,
        dateDeNaissance: dossier?.dateDeNaissance ?? dossier?.etatCivil?.dateDeNaissance ?? '',
        referenceComptable: dossier?.referenceComptable ?? dossier?.etatCivil?.referenceComptable ?? '',
        situationMatrimoniale: dossier?.situationMatrimoniale ?? dossier?.etatCivil?.situationMatrimoniale ?? null,
        statutPersonnel: dossier?.statutPersonnel?.id ?? null,
        nombreEnfant: dossier?.nombreEnfant ?? dossier?.etatCivil?.nombreEnfant ?? '',
        pieceIdentite: dossier?.pieceIdentite ?? dossier?.etatCivil?.pieceIdentite ?? '',
        numeroCnss: dossier?.numeroCnss ?? dossier?.organismeSocial?.numeroCnss ?? '',
        telephone: dossier?.telephone ?? dossier?.coordonnee?.telephone ?? '',
        dateEmbauchage: dossier?.dateEmbauchage ?? dossier?.posteGeneral?.dateEmbauchage ?? '',
        adresse: dossier?.coordonnee?.adresse ?? dossier?.adresseSecondaire ?? '',
        email: dossier?.email ?? dossier?.coordonnee?.email ?? '',
      },
      personneContacterGroupe: {
        telephoneContact: dossier?.telephoneContact ?? dossier?.coordonnee?.telephoneContact ?? '',
        prenomContact: dossier?.prenomContact ?? '',
        nomContact: dossier?.nomContact ?? '',
      },
      autrePersonnelGroupe: {
        poste: dossier?.poste?.id ?? dossier?.posteGeneral?.id ?? null,
        entite: dossier?.entite?.id ?? null,
        indice: dossier?.indice?.id ?? null,
      },
    });
  } else {
    // (reset inchangé)
    this.formulaireDossier.reset();
    this.formPersonnel.identitePersonnelGroupe['controls'].civilite.setValue(null);
    this.formPersonnel.identitePersonnelGroupe['controls'].situationMatrimoniale.setValue(null);
    this.formPersonnel.identitePersonnelGroupe['controls'].statutPersonnel.setValue(null);
    this.formPersonnel.autrePersonnelGroupe['controls'].poste.setValue(null);
    this.formPersonnel.autrePersonnelGroupe['controls'].entite.setValue(null);
    this.formPersonnel.autrePersonnelGroupe['controls'].indice.setValue(null);
  }
  this.modalService.open(content, { size: 'lg', centered: true });
}


  creerModifierPersonnel() {
    if (!this.formulaireDossier.valid) {
      this.errormsg('Formulaire invalide', 'Merci de vérifier les champs obligatoires.');
      return;
    }

    const f = this.formPersonnel;
    let formDataPersonnel: any = {
      // Etat civil (sans aucune donnée bancaire)
      matricule: f.identitePersonnelGroupe.controls.matricule.value ?? null,
      nom: f.identitePersonnelGroupe.controls.nom.value ?? null,
      prenom: f.identitePersonnelGroupe.controls.prenom.value ?? null,
      civilite: f.identitePersonnelGroupe.controls.civilite.value ?? null,
      dateDeNaissance: f.identitePersonnelGroupe.controls.dateDeNaissance.value ?? null,
      referenceComptable: f.identitePersonnelGroupe.controls.referenceComptable.value ?? null,
      situationMatrimoniale: f.identitePersonnelGroupe.controls.situationMatrimoniale.value ?? null,
      statutPersonnel: f.identitePersonnelGroupe.controls.statutPersonnel.value ?? null,
      nombreEnfant: f.identitePersonnelGroupe.controls.nombreEnfant.value ?? null,
      pieceIdentite: f.identitePersonnelGroupe.controls.pieceIdentite.value ?? null,
      numeroCnss: f.identitePersonnelGroupe.controls.numeroCnss.value ?? null,
      telephone: f.identitePersonnelGroupe.controls.telephone.value ?? null,
      dateEmbauchage: f.identitePersonnelGroupe.controls.dateEmbauchage.value ?? null,
      adresse: f.identitePersonnelGroupe.controls.adresse.value ?? null,
      email: f.identitePersonnelGroupe.controls.email.value ?? null,
      // Contact
      telephoneContact: f.personneContacterGroupe.controls.telephoneContact.value ?? null,
      prenomContact: f.personneContacterGroupe.controls.prenomContact.value ?? null,
      nomContact: f.personneContacterGroupe.controls.nomContact.value ?? null,

      // Autres
      poste: f.autrePersonnelGroupe.controls.poste.value ?? null,
      entite: f.autrePersonnelGroupe.controls.entite.value ?? null,
      indice: f.autrePersonnelGroupe.controls.indice.value ?? null,
    };

    formDataPersonnel = this.stripEmpty(formDataPersonnel);
    const id = this.formulaireDossier.get('id')?.value;

    if (id) {
      this.dossierService.modifierPersonnel(id, formDataPersonnel).subscribe({
        next: () => {
          this.modalService.dismissAll();
          this.chargerListePersonnelPage();
          this.successmsg('Personnel modifié', 'Le personnel a été modifié avec succès');
          this.formulaireDossier.reset();
        },
        error: (error) => {
          this.errormsg('Erreur', error?.error?.message || 'Une erreur est survenue lors de la modification.');
          const errs = error?.error?.errors || {};
          for (const k in errs) this.errormsg('Erreur', `${k} ${errs[k]}`);
        },
      });
    } else {
      this.dossierService.creerPersonnel(formDataPersonnel).subscribe({
        next: () => {
          this.modalService.dismissAll();
          this.chargerListePersonnelPage();
          this.successmsg('Personnel créé', 'Vous avez créé avec succès un nouveau personnel');
          this.formulaireDossier.reset();
        },
        error: (error) => {
          this.errormsg('Erreur', error?.error?.message || 'Une erreur est survenue lors de la création.');
          const errs = error?.error?.errors || {};
          for (const k in errs) this.errormsg('Erreur', `${k} ${errs[k]}`);
        },
      });
    }
  }

  supprimerPersonnel(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Suppression irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, supprimez-le !',
      cancelButtonText: 'Non, annuler',
    }).then((result) => {
      if (result.value) {
        this.dossierService.supprimerPersonnel(id).subscribe({
          next: () => {
            this.devisSbj.next(0);
            this.listeDossierPage = this.listeDossierPage.filter((i) => i.id !== id);
            this.successmsg('Personnel supprimé', 'Suppression réussie');
          },
          error: (err) => {
            this.errormsg('Personnel non supprimé', err?.error?.message || 'Erreur serveur');
          },
        });
      }
    });
  }

  trackById(index: number, d: Personnel): number | string {
    return d && (d as any).id != null ? (d as any).id : index;
  }

  retraitePersonnelGroupe() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Mettre en retraite (30 ans de service).',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, mettre en retraite',
      cancelButtonText: 'Non, annuler',
    }).then((result) => {
      if (result.value) {
        this.dossierService.retraitePersonnelEnGroupe().subscribe({
          next: () => this.successmsg('Personnels mis en retraite', 'Mise en retraite réussie'),
          error: (err) =>
            this.errormsg('Personnels non mis en retraite', err?.error?.message || 'Erreur serveur'),
        });
      }
    });
  }
}

// src/app/rh/mission/mission.component.ts
import { Component, OnInit } from '@angular/core';
import { DataStateEnum, ModelDataState } from "../../state/state";
import { BehaviorSubject, Observable, of } from "rxjs";

import {
  Mission,
  MissionStatut,
  computeEffectiveMissionStatus,
  missionBadgeClass
} from "../models/mission";

import { Imputation } from "../models/imputation";
import { MissionnaireExterne } from "../models/missionnaire-externe";
import { Personnel } from "../models/personnel";
import { TypeMission } from "../models/type-mission";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import Hashids from 'hashids';
import { PersonnelService } from "../services/personnel.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MissionService } from "../services/mission.service";
import { TypeMissionService } from "../services/type-mission.service";
import { ImputationService } from "../services/imputation.service";
import { catchError, map, startWith } from "rxjs/operators";
import Swal from "sweetalert2";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { MissionnaireExterneService } from "../services/missionnaire-externe.service";
import { UtilisateurService } from '../../utilisateur/services/utilisateur.service';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})
export class MissionComponent implements OnInit {
  items: any[] = [];
  dataStateEnum = DataStateEnum;
  state?: DataStateEnum;
  dossiers?: Observable<ModelDataState<Mission[]>>;
  listeDossierPage: Mission[] = [];

  listeImputation: Imputation[] = [];
  listeMissionnaireExterne: MissionnaireExterne[] = [];
  listePersonnel: any[] = [];
  listeTypeMission: TypeMission[] = [];

  public nom: string = '';
  public matricule: string = '';
  public prenom: string = '';
  public searchValue: string = '';
  public loading: boolean = false;
  public id?: number; // utilisé pour le rapport
  public designation: string = '';
  public reference: string = '';
  public sigle: string = '';
  pieces: File | undefined;

  formulaireDossier = new FormGroup({
    id: new FormControl<number | null>(null),
    dateDebut: new FormControl<Date | string | null>(new Date(), [Validators.required]),
    nbreJour: new FormControl<number | null>(null, [Validators.required]),
    motif: new FormControl<string>('', [Validators.required, Validators.maxLength(1000)]),
    personnelId: new FormControl<number | null>(null, [Validators.required]),
    moyenDeplacement: new FormControl<string>('', [Validators.required]),
  });

  // ÉLIGIBILITÉ
  eligibiliteOk = false;
  eligibiliteMessage: string | null = null;
  eligibiliteLoading = false;
  eligibiliteChefId: number | null = null;

  totalDossier: number = 0;
  currentPage: number = 0;
  dossierPerPage: number = 10;
  sort: string = "desc";
  public pages: number[] = [];
  totalPages: number = 0;
  hashids: any;
  devisSbj = new BehaviorSubject(0);

  // Enum dispo dans le template si tu veux : missionStatut.BROUILLON, etc.
  missionStatut = MissionStatut;

  constructor(
    private dossierService: MissionService,
    private typemissionService: TypeMissionService,
    private missionnaireExterneService: MissionnaireExterneService,
    private imputationService: ImputationService,
    private personnelService: PersonnelService,
    private router: Router,
    private httpClient: HttpClient,
    private toastService: ToastrService,
    private utilisateurService: UtilisateurService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    this.hashids = new Hashids('mysecretkey');

    this.items = [
      { label: 'Ressources Humaines' },
      { label: 'Missions', active: true }
    ];

    this.chargerListeMissionPage();

    // Chargement initial des personnels
    this.utilisateurService.personnelNonUtilisateur().subscribe(x => {
      const list = x ?? [];
      this.listePersonnel = list.map((p: any) => ({
        ...p,
        _displayName: this.buildDisplayNamePersonnel(p)
      }));
    });

    // Vérifie l’éligibilité à chaque changement de personnel
    this.formulaireDossier.get('personnelId')?.valueChanges.subscribe((val: any) => {
      this.eligibiliteOk = false;
      this.eligibiliteMessage = null;
      this.eligibiliteChefId = null;

      const id = Number(val);
      if (!id || isNaN(id)) return;

      this.eligibiliteLoading = true;
      this.dossierService.verifierEligibilite(id).subscribe({
        next: (res: any) => {
          this.eligibiliteOk = !!res.eligible;
          this.eligibiliteMessage = res.eligible ? null : (res.reason ?? "Non éligible à la création d'une mission.");
          this.eligibiliteChefId = res.chefId ?? null;
          this.eligibiliteLoading = false;
        },
        error: (err: any) => {
          console.error(err);
          this.eligibiliteOk = false;
          this.eligibiliteMessage = "Impossible de vérifier l'éligibilité pour ce personnel.";
          this.eligibiliteChefId = null;
          this.eligibiliteLoading = false;
        }
      });
    });
  }

  // --- Helpers dates --- //

  private isTodayBetweenDates(startDate: Date, endDate: Date): boolean {
    const today = new Date();
    return startDate <= today && endDate >= today;
  }

  /** Transforme un DTO renvoyé par le back en Mission attendue par l’IHM */
  
/** Transforme un DTO renvoyé par le back en Mission attendue par l’IHM */
// Transforme un DTO renvoyé par le back en Mission attendue par l’IHM
private hydrateDtoEnMission = (m: any): Mission => {
  console.log('DTO mission brut ===>', m);

  const startDate = m.dateDebut ? new Date(m.dateDebut) : null as any;
  const endDate   = m.dateFin ? new Date(m.dateFin) : null as any;

  // On reconstruit un "personnel" minimal à partir des champs à plat du DTO
  const personnel: Personnel = {
    id: m.personnelId ?? 0,
    prenom: m.personnelPrenom ?? '',
    nom: m.personnelNom ?? '',
  } as Personnel;

  const motif = m.motif ?? '';

  const hydratée: Mission = {
    id: m.id,
    reference: m.reference || '',
    objet: m.objet || '',
    motif,
    message: m.message || '',
    accompagne: m.accompagne || '',
    conducteur: m.conducteur || null,
    personnels: m.personnels || [],

    dateDebut: m.dateDebut,
    dateFin: m.dateFin,
    nbreJour: m.nbreJour,
    typeDemande: m.typeDemande || '',

    // ✅ très important pour l’affichage du personnel
    personnel: personnel,

    pieces: m.pieces || null,
    imputation: m.imputation || null,
    missionnaireExternes: m.missionnaireExternes || [],
    moyenTransport: m.moyenTransport || '',
    moyenDeplacement: m.moyenDeplacement || '',
    typeMission: m.typeMission || null,
    rapport: m.rapport || null,
    duree: m.duree || null,
    attestation: m.attestation || null,

    // ✅ on récupère bien le statut / etat envoyé par le back
    statut: m.statut ?? m.status ?? m.etat ?? null,
    status: m.status ?? null,
    etat: m.etat ?? null,

    // validations numériques éventuelles
    chefValidation: m.chefValidation ?? 9,
    csrhValidation: m.csrhValidation ?? 9,
    sgValidation: m.sgValidation ?? 9,
    dgValidation: m.dgValidation ?? 9,

    isTodayBetweenDates:
      startDate && endDate ? this.isTodayBetweenDates(startDate, endDate) : false,
  };

  console.log('Mission hydratée ===>', hydratée.statut, hydratée.personnel);
  return hydratée;
}



  // --- Recherche dans les listes --- //

  onSearchPersonnel(term: string) {
    if ((term ?? '').length >= 3) {
      this.personnelService.recherchePersonnel(term).subscribe(
        (response: any) => {
          const content = response.body?.content ?? response?.content ?? response ?? [];
          this.listePersonnel = (content || []).map((p: any) => ({
            ...p,
            _displayName: this.buildDisplayNamePersonnel(p)
          }));
        },
        () => {}
      );
    }
  }

  onSearchImputation(term: string) {
    if ((term ?? '').length >= 3) {
      this.imputationService.rechercheImputation(term).subscribe(
        (response: any) => {
          this.listeImputation = response.body?.content ?? [];
        },
        () => {}
      );
    }
  }

  onSearchTypeMission(term: string) {
    if ((term ?? '').length >= 3) {
      this.typemissionService.rechercheTypeMission(term).subscribe(
        (response: any) => {
          this.listeTypeMission = response.body?.content ?? [];
        },
        () => {}
      );
    }
  }

  onSearchMissionnaireExterne(term: string) {
    if ((term ?? '').length >= 3) {
      this.missionnaireExterneService.rechercheMissionnaireExterneNom(term).subscribe(
        (response: any) => {
          this.listeMissionnaireExterne = response.body?.content ?? [];
        },
        () => {}
      );
    }
  }

  // --- Chargement / Recherche --- //

  chargerListeMissionPage(): void {
    this.dossiers = this.dossierService
      .listerMissionPage(this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          const content = response?.body?.content ?? [];
          this.listeDossierPage = content.map((m: any) => this.hydrateDtoEnMission(m));

          this.totalDossier = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();

          return {
            dataState: this.dataStateEnum.CHARGE,
            data: this.listeDossierPage,
          };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT, data: [] as Mission[] }),
        catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] as Mission[] }))
      );
  }

  handleClick() {
    if (this.reference) {
      this.searchRefecrence();
    } else {
      this.chargerListeMissionPage();
    }
  }

  searchRefecrence(): void {
    this.dossiers = this.dossierService.rechercheMissionPage(this.sort, this.reference)
      .pipe(
        map((response: any) => {
          const content = response?.body?.content ?? [];
          this.listeDossierPage = content.map((m: any) => this.hydrateDtoEnMission(m));

          if (this.listeDossierPage.length === 0) {
            this.errormsg('Erreur', 'Aucun enregistrement ne correspond à votre recherche');
            this.chargerListeMissionPage();
          }

          this.totalDossier = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();

          return {
            dataState: this.dataStateEnum.CHARGE,
            data: this.listeDossierPage
          };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT, data: [] as Mission[] }),
        catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] as Mission[] }))
      );
  }

  onPageChangeReference(_: any): void {
    this.currentPage = 0;
    this.dossierPerPage = 10;
    if (this.reference && this.reference?.length >= 3) {
      this.searchRefecrence();
    } else if (!this.reference?.length) {
      this.chargerListeMissionPage();
    }
  }

  // --- Utilitaires UI --- //

  closeModal() {
    this.modalService.dismissAll();
  }

  successmsg(title = 'Mission ajoutée !', message = 'Vous venez d\'ajouter avec succès une nouvelle mission !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message: string) {
    Swal.fire(title, message, 'error');
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

encodeId(id: number | undefined): string {
  if (id === undefined || id === null) {
    return this.hashids.encode(0); // valeur par défaut si jamais
  }
  return this.hashids.encode(id);
}



  // --- Modals --- //

  openModal(content: any, dossier: Mission | undefined = undefined) {
    if (dossier) {
      this.formulaireDossier.patchValue({
        id: dossier.id ?? null,
        dateDebut: dossier.dateDebut ? new Date(dossier.dateDebut as any) : new Date(),
        nbreJour: dossier.nbreJour ?? null,
        motif: dossier.motif || '',
        personnelId: (dossier as any).personnelId || dossier.personnel?.id || null,
        moyenDeplacement: dossier.moyenDeplacement || ''
      });
      this.eligibiliteOk = true;
      this.eligibiliteMessage = null;
    } else {
      this.formulaireDossier.reset({
        id: null,
        dateDebut: new Date(),
        nbreJour: null,
        motif: '',
        personnelId: null,
        moyenDeplacement: ''
      });
      this.eligibiliteOk = false;
      this.eligibiliteMessage = null;
      this.eligibiliteChefId = null;
      this.pieces = undefined;
    }
    this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  // --- Création / Modification --- //

  creerModifierMission() {
    if (!this.formulaireDossier.valid) {
      this.toastService.error('Veuillez remplir tous les champs obligatoires', 'Erreur!');
      return;
    }
    if (!this.eligibiliteOk) {
      this.toastService.error(this.eligibiliteMessage || 'Ce personnel ne peut pas créer de mission (poste/chef manquant).', 'Mission');
      return;
    }

    const formData = new FormData();

    const dateDebutCtrl = this.formulaireDossier.get('dateDebut')?.value as any;
    if (dateDebutCtrl instanceof Date) {
      formData.append('dateDebut', dateDebutCtrl.toISOString().slice(0, 10));
    } else if (dateDebutCtrl) {
      formData.append('dateDebut', String(dateDebutCtrl).slice(0, 10));
    }

    const nbreJour = this.formulaireDossier.get('nbreJour')?.value;
    if (nbreJour != null) formData.append('nbreJour', String(nbreJour));

    const motif = this.formulaireDossier.get('motif')?.value ?? '';
    formData.append('motif', String(motif));

    const personnelId = this.formulaireDossier.get('personnelId')?.value;
    if (personnelId != null) formData.append('personnelId', String(personnelId));

    const moyenDeplacement = this.formulaireDossier.get('moyenDeplacement')?.value ?? '';
    formData.append('moyenDeplacement', String(moyenDeplacement));

    if (this.eligibiliteChefId != null) {
      formData.append('chefId', String(this.eligibiliteChefId));
    }

    if (this.pieces) {
      formData.append('pieces', this.pieces);
    }

    const missionId = this.formulaireDossier.get('id')?.value as number | null;

    if (missionId) {
      // Modification
      this.dossierService.modifierMission(missionId, formData).subscribe(
        (response: any) => {
          const hydrated = this.hydrateDtoEnMission(response);
          this.listeDossierPage = this.listeDossierPage.map(e => e.id === hydrated.id ? hydrated : e);

          this.modalService.dismissAll();
          if (hydrated.id) {
            this.router.navigate(['/rh/missions/details/', this.encodeId(hydrated.id)]);
          }

          this.successmsg("Mission modifiée", "La mission a été modifiée avec succès");
          this.formulaireDossier.reset();
        },
        (error: any) => this.handleError(error)
      );
    } else {
      // Création
      this.dossierService.creerMission(formData).subscribe(
        (response: any) => {
          const hydrated = this.hydrateDtoEnMission(response);
          this.listeDossierPage.unshift(hydrated);
          this.formulaireDossier.reset();
          this.modalService.dismissAll();
          this.chargerListeMissionPage();
          this.successmsg("Mission créée", "La mission a été créée avec succès");
        },
        (error: any) => this.handleError(error)
      );
    }
  }

  private handleError(error: any): void {
    if (error?.status === 500) {
      this.toastService.error('Erreur serveur (500). Vérifiez les champs envoyés.', 'Mission');
      return;
    }
    if (error.error?.errors) {
      const errors = error.error.errors;
      for (let i = 0; i < errors.length; i++) {
        const currentError = errors[i];
        this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
      }
    } else {
      this.toastService.error(
        error.error?.message || 'Erreur lors de l\'opération',
        'Erreur!'
      );
    }
  }

  // --- Suppression --- //

  supprimerMission(id: number) {
    Swal.fire({
      title: 'Êtes vous sûr ?',
      text: 'Êtes vous sûr de vouloir le supprimer. Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Supprimez-le!',
      cancelButtonText: 'Non, Annuler',
    }).then((result: any) => {
      if (result.value) {
        this.dossierService.supprimerMission(id).subscribe({
          next: (_: any) => {
            this.devisSbj.next(0);
            this.listeDossierPage = this.listeDossierPage.filter((i) => i.id !== id);
            this.successmsg('Suppression réussie', 'Mission supprimée');
          },
          error: (err: any) => {
            this.errormsg('Mission non supprimée', err.error?.message || 'Erreur inconnue');
          },
        });
      }
    });
  }

  buildDisplayNamePersonnel(p: any): string {
    const prenom = p?.etatCivil?.prenom ?? p?.prenom ?? '';
    const nom    = p?.etatCivil?.nom    ?? p?.nom    ?? '';
    const full   = `${prenom} ${nom}`.trim();
    const matricule = p?.matricule ?? p?.code ?? '';
    const base = full || matricule || `#${p?.id ?? ''}`;
    return base.trim();
  }

  // --- Rapport --- //

  openModalRapport(content: any, mission: Mission) {
    this.id = mission.id;
    this.modalService.open(content);
  }

  uploaderFicher($event: any) {
    if ($event.target.files.length > 0) {
      this.pieces = $event.target.files[0];
    }
  }

  // Téléchargement fichier depuis le back
  onTelechargerRapport(mission: Mission) {
    this.telechargerRapportMission(mission).subscribe({
      next: (resp: HttpResponse<ArrayBuffer>) => {
        const dispo =
          resp.headers.get('Content-Disposition') ||
          resp.headers.get('content-disposition') ||
          '';
        const match = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(dispo);
        const filename = match ? decodeURIComponent(match[1]) : `rapport-mission-${mission.id}.bin`;
        const mime = resp.headers.get('Content-Type') || 'application/octet-stream';

        this.triggerBrowserDownload(resp.body as ArrayBuffer, filename, mime);
        this.showPopOnDownloadRapportMission();
      },
      error: (_: any) => this.errormsg('Erreur', 'Téléchargement impossible')
    });
  }

  telechargerRapportMission(mission: Mission): Observable<HttpResponse<ArrayBuffer>> {
    const url = `${this.dossierService.contextPath}/${mission.id}/telecharger`;
    const authToken = sessionStorage.getItem("token");
    if (!authToken) throw new Error("Authorization token not found");

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    return this.httpClient.get(url, {
      responseType: 'arraybuffer',
      headers,
      observe: 'response'
    });
  }

  private triggerBrowserDownload(data: ArrayBuffer, filename?: string, mime = 'application/octet-stream') {
    const blob = new Blob([data], { type: mime });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'document';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  showPopOnDownloadRapportMission() {
    this.successmsg('Rapport de Mission téléchargé', "Le Rapport de la Mission a été bien téléchargé avec succès");
  }

  // Ajouter rapport
  ajouterRapport() {
    if (!this.id) {
      this.errormsg('Erreur', 'Mission inconnue.');
      return;
    }
    if (!this.pieces) {
      this.errormsg('Erreur', 'Veuillez sélectionner un fichier de rapport.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.pieces);

    this.dossierService.ajouterLeRapport(this.id, formData).subscribe({
      next: (_: any) => {
        this.modalService.dismissAll();
        this.chargerListeMissionPage();
        this.successmsg("Rapport ajouté", "Le rapport a été ajouté avec succès");
        this.pieces = undefined;
      },
      error: (error: any) => {
        if (error?.error?.errors?.length) {
          for (const e of error.error.errors) {
            this.toastService.error(`${e.champs}: ${e.message}`, 'Erreur!');
          }
        } else {
          this.errormsg('Erreur', error?.error?.message || 'Impossible d’ajouter le rapport.');
        }
      }
    });
  }

  // --- STATUT MISSION (même idée que Conge) --- //

  computeStatus(m: Mission): MissionStatut {
    return computeEffectiveMissionStatus(m);
  }

  badgeUnifie(m: Mission): string {
    return missionBadgeClass(m);
  }

  // --- WORKFLOW ADMIN MISSION --- //

  soumettre(m: Mission) {
  if (!m.id) return;
  this.dossierService.soumettre(m.id).subscribe({
    next: _ => {
      this.successmsg('Soumis', 'Mission soumise');
      this.chargerListeMissionPage();   // 🔁 comme congés
    },
    error: e => this.errormsg('Erreur', e?.error?.message || 'Soumission impossible')
  });
}
marquerPris(m: Mission) {
  if (!m.id) return;

  this.dossierService.marquerPris(m.id).subscribe({
    next: _ => {
      this.successmsg('Marquée prise', 'Mission marquée comme prise');
      this.chargerListeMissionPage();   // 🔁 recharge : le statut devient PRIS
    },
    error: e => this.errormsg('Erreur', e?.error?.message || 'Action impossible')
  });
}


approuverRh(m: Mission) {
  if (!m.id) return;

  this.dossierService.approuverRh(m.id).subscribe({
    next: _ => {
      this.successmsg('Approuvée', 'Mission approuvée par les RH');
      this.chargerListeMissionPage();   // 🔁 on recharge comme pour congés
    },
    error: e => this.errormsg('Erreur', e?.error?.message || 'Action impossible')
  });
}



rejeterRh(m: Mission) {
  if (!m.id) return;

  const motif = 'Motif de rejet'; // tu pourras mettre un Swal pour demander la raison

  this.dossierService.rejeterRh(m.id, motif).subscribe({
    next: (_: any) => {
      this.successmsg('Rejetée', 'Mission rejetée');
      this.chargerListeMissionPage();
    },
    error: (e: any) => this.errormsg('Erreur', e?.error?.message || 'Action impossible')
  });
}



  marquerTerminee(m: Mission) {
  if (!m.id) return;

  this.dossierService.marquerTerminee(m.id).subscribe({
    next: (res: Mission) => {
      const hydrated = this.hydrateDtoEnMission(res);
      this.listeDossierPage = this.listeDossierPage.map(x =>
        x.id === hydrated.id ? hydrated : x
      );
      this.successmsg('Terminée', 'Mission marquée comme terminée');
    },
    error: (e: any) => {
      this.errormsg('Erreur', e?.error?.message || 'Action impossible');
    }
  });
}

cloturer(m: Mission) {
  if (!m.id) return;

  this.dossierService.cloturer(m.id).subscribe({
    next: _ => {
      this.successmsg('Clôturée', 'Mission clôturée');
      this.chargerListeMissionPage();   // 🔁 recharge : plus de bouton
    },
    error: e => this.errormsg('Erreur', e?.error?.message || 'Action impossible')
  });
}


}

// src/app/rh/mes-missions/mes-missions.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MissionService } from '../services/mission.service';
import { TitredepageComponent } from '../../commun/titredepage/titredepage.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  Mission,
  MissionStatut,
  computeEffectiveMissionStatus,
  missionStatusBadgeClass
} from '../models/mission';

@Component({
  standalone: true,
  selector: 'app-mes-missions',
  imports: [CommonModule, TitredepageComponent, ReactiveFormsModule],
  templateUrl: './mes-missions.component.html',
  styles: [`
    .table { --bs-table-bg: transparent; }
    .table thead th { vertical-align: middle; }
    .table td, .table th { vertical-align: middle; }
    .table-sm> :not(caption)>*>* { padding: .45rem .6rem; }

    .col-id { width: 48px; white-space: nowrap; }
    .col-statut { width: 150px; white-space: nowrap; }
    .col-actions { width: 150px; }

    .row-hover:hover { background: rgba(0,0,0,.03); transition: background .12s; }

    .btn-ghost {
      transition: transform .12s ease, box-shadow .15s ease;
    }
    .btn-ghost:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(0,0,0,.08);
    }

    .page-btn { min-width: 36px; }
    .maxw-260 { max-width: 260px; }

    @media (max-width: 576px) {
      .col-actions { width: 1%; }
      .page-with-bg { padding-left: .25rem; padding-right: .25rem; }
    }
  `]
})
export class MesMissionsComponent implements OnInit {
  items = [
    { label: 'Ressources Humaines' },
    { label: 'Mes Missions', active: true }
  ];

  // Liste missions
  liste: Mission[] = [];
  total = 0;
  totalPages = 0;
  pages: number[] = [];
  page = 0;
  size = 10;
  sort = 'desc';
  loading = false;
  error = false;

  form!: FormGroup;
  file?: File;
  pieceName = '';
  submitting = false;
  currentPersonnelId: number | null = null;

  // Éligibilité
  eligibiliteOk = false;
  eligibiliteMessage: string | null = null;
  eligibiliteLoading = false;
  eligibiliteChefId: number | null = null;
  hasEligibiliteInfo = false;

  constructor(
    private missionSrv: MissionService,
    private modal: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    this.hydratePersonnelId();
    this.initForm();
    this.checkEligibilite();
    this.load();
  }

  /* ============ LISTE ============ */

  load(): void {
    this.loading = true;
    this.error = false;

    this.missionSrv.listerMesMissions(this.page, this.size, this.sort).subscribe({
      next: (resp: any) => {
        const body = resp?.body || {};
        const content: Mission[] = body.content || [];
        this.liste = content.map(m => this.decorateMission(m));
        this.total = body.totalElements || this.liste.length || 0;
        this.totalPages = body.totalPages || 1;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  /** Ajoute des infos dérivées (ex: isTodayBetweenDates) */
  private decorateMission(m: Mission): Mission {
    const start = m.dateDebut ? new Date(m.dateDebut as any) : null;
    const end   = m.dateFin   ? new Date(m.dateFin as any)   : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    (m as any).isTodayBetweenDates =
      !!(start && end && start <= today && end >= today);

    return m;
  }

  /* ============ STATUTS & SYNTHÈSE ============ */

  missionStatus(m: Mission): MissionStatut {
    return computeEffectiveMissionStatus(m);
  }

  missionBadgeClass(m: Mission): string {
    return missionStatusBadgeClass(m);
  }

  missionStatusText(m: Mission): string {
    const s = this.missionStatus(m);
    switch (s) {
      case MissionStatut.BROUILLON: return 'Brouillon';
      case MissionStatut.SOUMIS:    return 'Soumise';
      case MissionStatut.APPROUVEE: return 'Approuvée';
      case MissionStatut.CLOTUREE:  return 'Clôturée';
      case MissionStatut.REJETEE:   return 'Rejetée';
      default:                      return String(s);
    }
  }

  /** Helper : mission rejetée (gère REJETEE, REJETE_RH, etc.) */
  private isRejetee(m: Mission): boolean {
    const label = this.missionStatusText(m).toUpperCase();
    return label.includes('REJET');
  }

  /** Compteurs : basés sur le texte, pas sur l'enum brut */
  get nbBrouillons(): number {
    return this.liste.filter(m => this.missionStatusText(m) === 'Brouillon').length;
  }

  get nbSoumises(): number {
    return this.liste.filter(m => this.missionStatusText(m) === 'Soumise').length;
  }

  get nbApprouvees(): number {
    return this.liste.filter(m => this.missionStatusText(m) === 'Approuvée').length;
  }

  get nbCloturees(): number {
    return this.liste.filter(m => {
      const t = this.missionStatusText(m);
      return t.startsWith('Clôtur') || t.toUpperCase().includes('CLOTUR');
    }).length;
  }

  get nbRejetees(): number {
    return this.liste.filter(m => this.isRejetee(m)).length;
  }

  /** Mission en cours aujourd’hui (et non rejetée) */
  get missionEnCours(): Mission | null {
    const mc = this.liste.find(m =>
      (m as any).isTodayBetweenDates && !this.isRejetee(m)
    );
    return mc || null;
  }

  /** Prochaine mission (future, non rejetée) */
  get prochaineMission(): Mission | null {
    if (!this.liste.length) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const candidats = this.liste
      .filter(m => m.dateDebut && !this.isRejetee(m))
      .map(m => ({
        mission: m,
        date: new Date(m.dateDebut as any)
      }))
      .filter(x => !isNaN(x.date.getTime()) && x.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return candidats.length ? candidats[0].mission : null;
  }

  /* ============ TABLE / PAGINATION ============ */

  dlPieces(item: Mission): void {
    window.open(`${this.missionSrv.contextPath}/${item.id}/telecharger`, '_blank');
  }

  goto(p: number): void {
    if (p >= 0 && p < this.totalPages) {
      this.page = p;
      this.load();
    }
  }

  prev(): void { this.goto(this.page - 1); }
  next(): void { this.goto(this.page + 1); }

  /* ============ CRÉATION ============ */

  private hydratePersonnelId(): void {
    const raw = sessionStorage.getItem('personnelId');
    this.currentPersonnelId = raw != null && raw !== '' ? Number(raw) : null;
  }

  private todayISO(): string {
    const d = new Date();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  private initForm(): void {
    this.form = this.fb.group({
      dateDebut: [this.todayISO(), Validators.required],
      nbreJour:  [1, [Validators.required, Validators.min(1)]],
      moyenDeplacement: ['', Validators.required],
      motif:     ['', Validators.required],
    });
  }

  // Vérif éligibilité
  private checkEligibilite(): void {
    if (!this.currentPersonnelId) {
      this.hasEligibiliteInfo = false;
      this.eligibiliteOk = false;
      this.eligibiliteMessage = null;
      this.eligibiliteLoading = false;
      this.eligibiliteChefId = null;
      return;
    }

    this.hasEligibiliteInfo = true;
    this.eligibiliteLoading = true;
    this.eligibiliteOk = false;
    this.eligibiliteMessage = null;
    this.eligibiliteChefId = null;

    this.missionSrv.verifierEligibilite(this.currentPersonnelId).subscribe({
      next: (res: any) => {
        this.eligibiliteOk = !!res.eligible;
        this.eligibiliteMessage = res.eligible
          ? null
          : (res.reason ?? "Vous n'êtes pas éligible à la création d'une mission.");
        this.eligibiliteChefId = res.chefId ?? null;
        this.eligibiliteLoading = false;
      },
      error: () => {
        this.eligibiliteOk = false;
        this.eligibiliteMessage = "Impossible de vérifier votre éligibilité pour le moment.";
        this.eligibiliteChefId = null;
        this.eligibiliteLoading = false;
      }
    });
  }

  openCreate(tpl: any): void {
    if (this.hasEligibiliteInfo && !this.eligibiliteOk) {
      alert(this.eligibiliteMessage || "Vous ne pouvez pas créer une mission pour le moment.");
      return;
    }

    this.file = undefined;
    this.pieceName = '';
    this.form.reset({
      dateDebut: this.todayISO(),
      nbreJour: 1,
      moyenDeplacement: '',
      motif: ''
    });
    this.modal.open(tpl, { size: 'lg', backdrop: 'static' });
  }

  onFile(ev: any): void {
    const f = ev?.target?.files?.[0];
    this.file = f;
    this.pieceName = f ? f.name : '';
  }

  submit(modalRef: any): void {
    if (this.form.invalid) return;

    if (this.hasEligibiliteInfo && !this.eligibiliteOk) {
      alert(this.eligibiliteMessage || "Vous n'êtes pas éligible à la création d'une mission.");
      return;
    }

    this.submitting = true;

    const fd = new FormData();
    fd.append('dateDebut', String(this.form.value.dateDebut || ''));
    fd.append('nbreJour',  String(this.form.value.nbreJour  || ''));
    fd.append('moyenDeplacement', String(this.form.value.moyenDeplacement || ''));
    fd.append('motif',     String(this.form.value.motif     || ''));

    if (this.currentPersonnelId != null) {
      fd.append('personnelId', String(this.currentPersonnelId));
    }

    if (this.eligibiliteChefId != null) {
      fd.append('chefId', String(this.eligibiliteChefId));
    }

    if (this.file) {
      fd.append('pieces', this.file);
    }

    this.missionSrv.creerMission(fd).subscribe({
      next: (created: Mission) => {
        this.liste.unshift(this.decorateMission(created));
        this.submitting = false;
        modalRef.close();
      },
      error: (err: any) => {
        this.submitting = false;
        console.error('POST /missions -> erreur:', err?.error);
        alert(err?.error?.message || 'Erreur lors de la création de la mission.');
      }
    });
  }
}

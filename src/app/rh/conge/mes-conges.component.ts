import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CongeService } from '../services/conge.service';
import { Conge } from '../models/conge';
import { DataStateEnum, ModelDataState } from '../../state/state';
import { CommonModule } from '@angular/common';
import { TitredepageComponent } from '../../commun/titredepage/titredepage.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { computeEffectiveStatus, statusBadgeClass } from '../models/conge';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-mes-conges',
  templateUrl: './mes-conges.component.html',
  standalone: true,
  imports: [CommonModule, TitredepageComponent, ReactiveFormsModule],
  styles: [`
    /* ====== Compactage & alignements ====== */
    .table { --bs-table-bg: transparent; }
    .table thead th { vertical-align: middle; }
    .table td, .table th { vertical-align: middle; }
    .table-sm> :not(caption)>*>* { padding: .45rem .6rem; } /* compact */

    .col-id { width: 48px; white-space: nowrap; }
    .col-type { width: 120px; white-space: nowrap; }
    .col-j { width: 70px; white-space: nowrap; }
    .col-statut { width: 150px; white-space: nowrap; }
    .col-actions { width: 140px; }

    /* Réduit l’espace visuel entre # et Type */
    .col-id + .col-type { padding-left: .4rem; }

    /* Badge type : compact + hover subtil (on garde les couleurs Bootstrap) */
    .badge-type { font-weight: 500; border-radius: .5rem; }
    .badge-type:hover { transform: translateY(-1px); transition: transform .15s ease; }

    /* Hover ligne */
    .row-hover:hover { background: rgba(0,0,0,.03); transition: background .12s; }

    /* Bouton "fantôme" outline avec hover doux (sans changer les couleurs) */
    .btn-ghost {
      transition: transform .12s ease, box-shadow .15s ease;
    }
    .btn-ghost:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(0,0,0,.08);
    }

    /* Boutons de pagination plus denses */
    .page-btn { min-width: 36px; }

    /* En-tête collant dans la table responsive */
    .table-responsive thead.sticky-top { top: -1px; z-index: 2; }

    /* Petits écrans : on masque certaines colonnes pour respirer */
    @media (max-width: 576px) {
      .col-actions { width: 1%; }
      .page-with-bg { padding-left: .25rem; padding-right: .25rem; }
    }
  `]
})
export class MesCongesComponent implements OnInit {
  dataStateEnum = DataStateEnum;

  conges$!: Observable<ModelDataState<Conge[]>>;
  list: Conge[] = [];

  total = 0;
  page  = 0;
  size  = 10;
  sort  = 'id,desc';
  pages: number[] = [];

  loading = false;
  error   = false;

  // modal détail
  detail: Conge | null = null;

  // création
  form!: FormGroup;
  file?: File;
  pieceName = '';
  submitting = false;
  currentPersonnelId: number | null = null;

  constructor(
    private service: CongeService,
    private modal: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.hydratePersonnelId();
    this.load();
    this.form = this.fb.group({
      dateDebut: [this.todayISO(), Validators.required],
      nbreJour:  [1, [Validators.required, Validators.min(1)]],
      typeConge: ['Conge Annuel', Validators.required],
      motif:     ['', Validators.required],
    });
  }

  /* ========= Data ========= */

  load() {
    this.loading = true;
    this.error   = false;

    this.service.listerMesConges(this.page, this.size, this.sort)
      .subscribe({
        next: (resp) => {
          const body = (resp as any)?.body;
          this.list  = body?.content ?? [];
          this.total = body?.totalElements ?? this.list.length ?? 0;
          const totalPages = body?.totalPages ?? 1;
          this.pages = Array.from({length: totalPages}, (_, i) => i);
          this.loading = false;
        },
        error: _ => {
          this.loading = false;
          this.error   = true;
        }
      });
  }

  goto(p: number) {
    this.page = p;
    this.load();
  }

  /* ========= Create ========= */

  openCreate(tpl: any) {
    this.file = undefined;
    this.pieceName = '';
    this.form.reset({
      dateDebut: this.todayISO(),
      nbreJour: 1,
      typeConge: 'Conge Annuel',
      motif: ''
    });
    this.modal.open(tpl, { size: 'lg', backdrop: 'static' });
  }

  onFile(ev: any) {
    const f = ev?.target?.files?.[0];
    this.file = f;
    this.pieceName = f ? f.name : '';
  }

  submit(modalRef: any) {
    if (this.form.invalid) return;
    this.submitting = true;

    const fd = new FormData();
    fd.append('dateDebut', String(this.form.value.dateDebut || ''));
    fd.append('nbreJour',  String(this.form.value.nbreJour  || ''));
    fd.append('typeConge', String(this.form.value.typeConge || ''));
    fd.append('motif',     String(this.form.value.motif     || ''));

    if (this.currentPersonnelId != null) {
      fd.append('personnelId', String(this.currentPersonnelId));
    }
    if (this.file) fd.append('pieces', this.file);

    this.service.creerConge(fd).subscribe({
      next: (created) => {
        this.list.unshift(created);
        this.submitting = false;
        modalRef.close();
      },
      error: (err) => {
        this.submitting = false;
        console.error('POST /conges -> 400 details:', err?.error);
        alert(err?.error?.message || 'Requête invalide (400) : vérifie les champs requis.');
      }
    });
  }

  /* ========= Helpers ========= */

  private hydratePersonnelId() {
    const raw = sessionStorage.getItem('personnelId');
    this.currentPersonnelId = raw != null && raw !== '' ? Number(raw) : null;
    // Plan B: via un service auth si besoin
  }

  private todayISO(): string {
    const d = new Date();
    const m = (d.getMonth()+1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  computeStatus(c: Conge) { return computeEffectiveStatus(c); }
  badgeUnifie(c: Conge) { return statusBadgeClass(c); }

  /** number|boolean|null|undefined → number|null */
  private toNum(v: number | boolean | null | undefined): number | null {
    if (v === true)  return 1;
    if (v === false) return 0;
    if (v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  }

  labelStatut(v: number | boolean | null | undefined): string {
    const n = this.toNum(v);
    if (n === 1) return 'Validé';
    if (n === 0) return 'Rejeté';
    if (n === 9) return 'En cours';
    return '—';
  }

  badgeClass(v: number | boolean | null | undefined): string {
    const n = this.toNum(v);
    if (n === 1) return 'bg-success';
    if (n === 0) return 'bg-danger';
    if (n === 9) return 'bg-info';
    return 'bg-secondary';
  }

  /** Statut global à partir des 4 étapes */
  private globalStatus(c: Conge): number {
    const steps = [
      this.toNum((c as any).chefValidation),
      this.toNum((c as any).csrhValidation),
      this.toNum((c as any).sgValidation),
      this.toNum((c as any).dgValidation),
    ].filter(v => v !== null) as number[];

    if (!steps.length) return -1;
    if (steps.includes(0)) return 0;              // un rejet → Rejeté
    if (steps.every(v => v === 1)) return 1;      // tout validé → Validé
    if (steps.includes(9)) return 9;              // au moins un "en cours"
    return -1;
  }

  labelGlobal(c: Conge): string {
    const n = this.globalStatus(c);
    if (n === 1) return 'Validé';
    if (n === 0) return 'Rejeté';
    if (n === 9) return 'En cours';
    return '—';
  }

  badgeGlobal(c: Conge): string {
    const n = this.globalStatus(c);
    if (n === 1) return 'bg-success';
    if (n === 0) return 'bg-danger';
    if (n === 9) return 'bg-info';
    return 'bg-secondary';
  }

  /** Couleur selon le type – accepte null/undefined */
  typeClass(type: string | null | undefined): string {
    const t = (type || '').toLowerCase();
    if (t.includes('annuel')) return 'bg-primary';
    if (t.includes('legal') || t.includes('légal')) return 'bg-warning';
    if (t.includes('maladie')) return 'bg-danger';
    return 'bg-secondary';
  }

  /* ========= Modal détail ========= */
  openDetail(c: Conge, tpl: any) {
    this.detail = c;
    this.modal.open(tpl, { size: 'md', backdrop: 'static' });
  }
}

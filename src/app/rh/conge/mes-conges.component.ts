import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';
import { CongeService } from '../services/conge.service';
import { Conge } from '../models/conge';
import { DataStateEnum, ModelDataState } from '../../state/state';
import { CommonModule } from '@angular/common';

// Optionnel si ton <app-titredepage> est standalone.
// Sinon, enlève-le ici ET dans le HTML.
import { TitredepageComponent } from '../../commun/titredepage/titredepage.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mes-conges',
  templateUrl: './mes-conges.component.html',
  standalone: true,
  imports: [CommonModule, TitredepageComponent],
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

  // pour la modal de détails
  detail: any = null;

  constructor(private service: CongeService, private modal: NgbModal) {}

  ngOnInit(): void {
    this.load();
  }

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

  // ================= Helpers UI =================

  /** number|boolean|null|undefined → number|null */
  private toNum(v: number | boolean | null | undefined): number | null {
    if (v === true)  return 1;
    if (v === false) return 0;
    if (v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  }

  /** Libellé pour Chef/CSRH/SG/DG */
  labelStatut(v: number | boolean | null | undefined): string {
    const n = this.toNum(v);
    if (n === 1) return 'Validé';
    if (n === 0) return 'Rejeté';
    if (n === 9) return 'En cours';
    return '—';
  }

  /** Classe Bootstrap pour un badge individuel */
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
    if (steps.includes(9)) return 9;              // sinon au moins un "en cours"
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

  /** Couleur selon le type */
  typeClass(type: string | undefined): string {
    const t = (type || '').toLowerCase();
    if (t.includes('annuel')) return 'bg-primary';
    if (t.includes('legal') || t.includes('légal')) return 'bg-warning';
    if (t.includes('maladie')) return 'bg-danger';
    return 'bg-secondary';
  }

  // ================ Modal détails ================
  openDetail(c: Conge, tpl: any) {
    this.detail = c;
    this.modal.open(tpl, { size: 'md', backdrop: 'static' });
  }
}

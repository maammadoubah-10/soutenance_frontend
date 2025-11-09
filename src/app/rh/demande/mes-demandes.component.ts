// src/app/rh/demande/mes-demandes.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TitredepageComponent } from '../../commun/titredepage/titredepage.component';
import { DemandeService } from '../services/demande.service';

@Component({
  standalone: true,
  selector: 'app-mes-demandes',
  imports: [CommonModule, ReactiveFormsModule, NgbModalModule, TitredepageComponent],
  template: `
  <div class="container-fluid px-3 page-with-bg">
    <app-titredepage title="Mes demandes" [items]="[{label:'RH'}, {label:'Mes demandes', active:true}]"></app-titredepage>

    <div class="card">
      <div class="card-body">

        <!-- Barre d'actions minimaliste -->
        <div class="d-flex flex-wrap gap-2 mb-3">
          <button class="btn btn-primary btn-sm" (click)="openModal(formTpl)">Nouvelle demande</button>
          <div class="ms-auto small text-muted">Total: {{ totalElements }}</div>
        </div>

        <!-- Etats de chargement -->
        <div *ngIf="loading" class="alert alert-info mb-0">Chargement…</div>
        <div *ngIf="error" class="alert alert-danger mb-0">Erreur de chargement</div>

        <!-- Liste -->
        <div *ngIf="!loading && !error" class="table-responsive">
           <table class="table table-striped align-middle">
      <thead>
        <tr>
          <th class="text-nowrap">#</th>
          <th class="text-nowrap">Type</th>
          <th class="text-nowrap">Début</th>
          <th class="text-nowrap">Fin</th>
          <th class="text-nowrap">Jours</th>
          <th class="text-nowrap">Pièce</th>
          <th>Motif</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let d of liste; index as i">
          <td>{{ i + 1 + (page * size) }}</td>

          <td>
            <span class="badge" [ngClass]="badgeType(d?.typeDemande)">
              {{ afficherType(d?.typeDemande) }}
            </span>
          </td>

          <td>{{ toDate(d?.dateDebut ?? d?.dateDebutStr ?? d?.date) | date:'dd/MM/yyyy' }}</td>
          <td>{{ toDate(d?.dateFin   ?? d?.dateFinStr   ?? d?.dateFinCalc) | date:'dd/MM/yyyy' }}</td>

          <td>{{ d?.nbreJour ?? '—' }}</td>

          <td class="text-nowrap">
            <button *ngIf="d?.pieces" class="btn btn-outline-secondary btn-sm"
                    (click)="download(d?.id)">
              Télécharger
            </button>
            <span *ngIf="!d?.pieces" class="text-muted">—</span>
          </td>

          <td>
            <span [title]="d?.motif || ''">
              {{ (d?.motif || '') | slice:0:60 }}<ng-container *ngIf="(d?.motif || '').length>60">…</ng-container>
            </span>
          </td>
        </tr>

        <tr *ngIf="!liste.length">
          <td colspan="7" class="text-center">Aucune demande</td>
        </tr>
      </tbody>
    </table>

          <!-- Pagination simple -->
          <div class="d-flex justify-content-end align-items-center" *ngIf="totalPages > 1">
            <button class="btn btn-outline-primary btn-sm me-2"
                    [disabled]="page===0"
                    (click)="goto(page-1)">Précédent</button>

            <ng-container *ngFor="let p of pages">
              <button class="btn btn-sm mx-1"
                      [class.btn-primary]="p===page"
                      [class.btn-outline-primary]="p!==page"
                      (click)="goto(p)">{{ p+1 }}</button>
            </ng-container>

            <button class="btn btn-outline-primary btn-sm ms-2"
                    [disabled]="page+1===totalPages"
                    (click)="goto(page+1)">Suivant</button>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- Modal (Créer/Modifier) -->
  <ng-template #formTpl let-modal>
    <div class="modal-header">
      <h5 class="modal-title mb-0">{{ form.get('id')?.value ? 'Modifier' : 'Créer' }} une demande</h5>
      <button type="button" class="btn-close" (click)="modal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <form [formGroup]="form" (ngSubmit)="save(modal)">
        <div class="row">
          <div class="col-md-4 mb-3">
            <label class="form-label">Date début *</label>
            <input type="date" class="form-control" formControlName="dateDebut">
          </div>

          <div class="col-md-4 mb-3">
            <label class="form-label">Nombre de jours *</label>
            <input type="number" min="1" class="form-control" formControlName="nbreJour">
          </div>

          <div class="col-md-4 mb-3">
            <label class="form-label">Type *</label>
            <select class="form-select" formControlName="typeDemande">
              <option value="">— Sélectionner —</option>
              <option value="CONGE_PAYE">Congé payé</option>
              <option value="CONGE_SANS_SOLDE">Congé sans solde</option>
              <option value="AUTORISATION_ABSENCE">Autorisation d'absence</option>
            </select>
          </div>

          <div class="col-md-12 mb-3">
            <label class="form-label">Pièce jointe</label>
            <input type="file" class="form-control" (change)="onFile($event)">
          </div>

          <div class="col-md-12 mb-2">
            <label class="form-label">Motif</label>
            <textarea rows="4" class="form-control" formControlName="motif"></textarea>
          </div>
        </div>

        <div class="text-end">
          <button type="button" class="btn btn-secondary me-2" (click)="modal.dismiss()">Annuler</button>
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid || saving">
            {{ saving ? 'Patientez…' : (form.get('id')?.value ? 'Enregistrer' : 'Créer') }}
          </button>
        </div>
      </form>
    </div>
  </ng-template>
  `
})
export class MesDemandesComponent implements OnInit {
  loading = false;
  error = false;
  saving = false;

  liste: any[] = [];
  page = 0; size = 10;
  totalElements = 0; totalPages = 0; pages: number[] = [];

  form: FormGroup;
  private file: File | null = null;

  // ⚠️ Renseigne ton personnelId depuis la session si besoin
  private personnelId: number = Number(sessionStorage.getItem('personnelId') || localStorage.getItem('personnelId') || 0);

  constructor(
    private fb: FormBuilder,
    private srv: DemandeService,
    private modal: NgbModal,
  ) {
    this.form = this.fb.group({
      id: [null],
      dateDebut: [null, Validators.required],
      nbreJour: [null, Validators.required],
      typeDemande: ['', Validators.required],
      motif: [''],
      personnelId: [null]
    });
  }

  ngOnInit(): void { this.load(); }

  goto(p: number) { this.page = p; this.load(); }

  afficherType(t: any): string {
    if (!t) return '—';
    if (typeof t === 'string') return t;
    return t?.libelle || t?.code || '—';
  }

  badgeType(t: any): string {
    const v = (typeof t === 'string' ? t : (t?.code || t?.libelle || '')).toUpperCase();
    // palette simple & lisible
    if (v.includes('PAYE'))          return 'bg-success';
    if (v.includes('SANS') || v.includes('SOLDE')) return 'bg-warning';
    if (v.includes('ABSENCE'))       return 'bg-info';
    return 'bg-secondary';
  }
private load() {
    this.loading = true; this.error = false;
    this.srv.listerMesDemandes(this.page, this.size, 'desc').subscribe({
      next: (resp: any) => {
        const body = resp?.body || {};
        const rows = body.content || [];

        // ★★ Normalisation: on s’assure d’avoir toujours dateDebut et dateFin exploitables
        this.liste = rows.map((x: any) => {
          const dateDebutRaw = x.dateDebut ?? x.dateDebutStr ?? x.date ?? null;
          const dateFinRaw   = x.dateFin   ?? x.dateFinStr   ?? null;

          // fallback: calcule dateFin = dateDebut + nbreJour (si backend ne la renvoie pas)
          let dateFinCalc: string | null = null;
          if (!dateFinRaw && dateDebutRaw && x.nbreJour != null) {
            const add = Number(x.nbreJour) || 0;
            const d0  = this.toDate(dateDebutRaw);
            if (d0) {
              const d = new Date(d0);
              d.setDate(d.getDate() + add);
              // on stocke une ISO courte, compatible avec DatePipe
              dateFinCalc = d.toISOString();
            }
          }

          return {
            ...x,
            dateDebut: dateDebutRaw,
            dateFin: dateFinRaw,
            dateFinCalc
          };
        });

        this.totalElements = body.totalElements ?? this.liste.length;
        this.totalPages    = body.totalPages ?? 1;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
        this.loading = false;
      },
      error: _ => { this.error = true; this.loading = false; }
    });
  }

   toDate(v: any): Date | null {
    if (!v) return null;
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
    // v est string (souvent 'yyyy-MM-dd' ou ISO)
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  openModal(tpl: any, row?: any) {
    this.form.reset(); this.file = null;
    if (row) {
      this.form.patchValue({
        id: row.id,
        dateDebut: this.formatDateInput(row.dateDebut),
        nbreJour: row.nbreJour,
        typeDemande: typeof row.typeDemande === 'string'
          ? row.typeDemande
          : (row.typeDemande?.code || row.typeDemande?.libelle || ''),
        motif: row.motif || ''
      });
    }
    this.modal.open(tpl, { size: 'lg', backdrop: 'static', keyboard: false });
  }

  onFile(e: any) { this.file = e?.target?.files?.[0] ?? null; }

  save(modal: any) {
    if (this.form.invalid) return;
    this.saving = true;

    const fd = new FormData();
    fd.append('dateDebut', String(this.form.value.dateDebut));
    fd.append('nbreJour', String(this.form.value.nbreJour));
    fd.append('typeDemande', String(this.form.value.typeDemande || ''));
    fd.append('motif', String(this.form.value.motif || ''));
    fd.append('personnelId', String(this.personnelId || 0));
    if (this.file) fd.append('pieces', this.file);

    const id = this.form.value.id;
    const req$ = id ? this.srv.modifierDemande(id, fd) : this.srv.creerDemande(fd);

    req$.subscribe({
      next: _ => { this.saving = false; modal.close(); this.load(); },
      error: _ => { this.saving = false; }
    });
  }

  download(id?: number) {
    if (!id) return;
    this.srv.telechargerFichier(id).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `demande-${id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }

  private formatDateInput(d: any): string | null {
    if (!d) return null;
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return null;
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth()+1).padStart(2,'0');
    const dd = String(dt.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  }
}

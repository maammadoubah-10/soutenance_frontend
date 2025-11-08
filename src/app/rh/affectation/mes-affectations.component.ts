import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitredepageComponent } from '../../commun/titredepage/titredepage.component';
import { AffectationService } from '../services/affectation.service';

@Component({
  standalone: true,
  selector: 'app-mes-affectations',
  imports: [CommonModule, TitredepageComponent],
  template: `
  <div class="container-fluid px-3 page-with-bg">
    <app-titredepage
      title="Mes affectations"
      [items]="[{label:'RH'}, {label:'Mes affectations', active:true}]">
    </app-titredepage>

    <div class="card">
      <div class="card-body">

        <!-- Barre d’info -->
        <div class="d-flex flex-wrap gap-2 mb-3">
          <div class="small text-muted">Historique de mes affectations</div>
          <div class="ms-auto small text-muted">Total: {{ totalElements }}</div>
        </div>

        <!-- Etats -->
        <div *ngIf="loading" class="alert alert-info mb-0">Chargement…</div>
        <div *ngIf="error" class="alert alert-danger mb-0">Erreur de chargement</div>

        <!-- Liste -->
        <div *ngIf="!loading && !error" class="table-responsive">
          <table class="table table-striped align-middle">
            <thead>
              <tr>
                <th class="text-nowrap">#</th>
                <th class="text-nowrap">Poste</th>
                <th class="text-nowrap">Service</th>
                <th class="text-nowrap">Date début</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of liste; index as i">
                <td>{{ i + 1 + (page * size) }}</td>
                <td>
                  <span class="badge" [ngClass]="badgePoste(a?.poste?.designation)">
                    {{ a?.poste?.designation || '—' }}
                  </span>
                </td>
                <td>{{ a?.poste?.service?.designation || '—' }}</td>
                <td>{{ a?.dateDebut | date:'dd/MM/yyyy' }}</td>
              </tr>

              <tr *ngIf="!liste.length">
                <td colspan="4" class="text-center">Aucune affectation</td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
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
  `
})
export class MesAffectationsComponent implements OnInit {
  loading = false;
  error = false;

  liste: any[] = [];
  page = 0; size = 10;
  totalElements = 0; totalPages = 0; pages: number[] = [];

  constructor(private srv: AffectationService) {}

  ngOnInit(): void { this.load(); }

  goto(p: number) { this.page = p; this.load(); }

  private load() {
    this.loading = true; this.error = false;
    this.srv.listerMesAffectations(this.page, this.size, 'id,desc').subscribe({
      next: (resp: any) => {
        const body = resp?.body || {};
        this.liste = body.content || [];
        this.totalElements = body.totalElements ?? this.liste.length;
        this.totalPages = body.totalPages ?? 1;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
        this.loading = false;
      },
      error: _ => { this.error = true; this.loading = false; }
    });
  }

  /** Couleur douce par poste (même esprit que badges type de demande) */
  badgePoste(label?: string): string {
    const v = (label || '').toLowerCase();
    if (v.includes('chef') || v.includes('responsable')) return 'bg-primary';
    if (v.includes('stagiaire') || v.includes('assist'))  return 'bg-info';
    if (v.includes('techn') || v.includes('dev'))         return 'bg-success';
    return 'bg-secondary';
  }
}

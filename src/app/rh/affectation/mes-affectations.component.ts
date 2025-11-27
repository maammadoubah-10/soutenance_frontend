import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitredepageComponent } from '../../commun/titredepage/titredepage.component';
import { AffectationService } from '../services/affectation.service';
import { Affectation } from '../models/affectation';

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
          <div class="small text-muted">
            Historique de mes affectations
          </div>
          <div class="ms-auto small text-muted">
            Total: {{ totalElements }}
          </div>
        </div>

        <!-- Poste actuel (si dispo) -->
        <div *ngIf="posteActuel" class="alert alert-primary d-flex flex-wrap align-items-center mb-3">
          <div class="me-2 fw-semibold">
            Poste actuel :
          </div>
          <div class="me-2">
            <span class="badge" [ngClass]="badgePoste(posteActuel?.poste?.designation)">
              {{ posteActuel?.poste?.designation || '—' }}
            </span>
          </div>
          <div class="me-2 text-muted small">
            {{ posteActuel?.poste?.service?.designation || '—' }}
          </div>
          <div class="ms-auto small">
            Depuis le {{ posteActuel?.dateDebut | date:'dd/MM/yyyy' }}
          </div>
        </div>

        <!-- Etats -->
        <div *ngIf="loading" class="alert alert-info mb-0">Chargement…</div>

        <div *ngIf="error" class="alert alert-danger mb-0">
          {{ errorMessage }}
        </div>

        <!-- Liste -->
        <div *ngIf="!loading && !error" class="table-responsive">
          <table class="table table-striped align-middle">
            <thead>
              <tr>
                <th class="text-nowrap">#</th>
                <th class="text-nowrap">Poste</th>
                <th class="text-nowrap">Service</th>
                <th class="text-nowrap">Date début</th>
                <th class="text-nowrap">Statut</th>
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

                <td>
                  <span
                    class="badge"
                    [ngClass]="(page === 0 && i === 0) ? 'bg-success' : 'bg-secondary'">
                    {{ (page === 0 && i === 0) ? 'Actuel' : 'Ancienne' }}
                  </span>
                </td>
              </tr>

              <tr *ngIf="!liste.length">
                <td colspan="5" class="text-center">
                  Vous n'avez encore aucune affectation enregistrée.
                </td>
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
  errorMessage = 'Erreur de chargement';

  liste: Affectation[] = [];
  page = 0;
  size = 10;
  totalElements = 0;
  totalPages = 0;
  pages: number[] = [];

  constructor(private srv: AffectationService) {}

  ngOnInit(): void {
    this.load();
  }

  /** Poste actuel = première affectation de la première page (triée du plus récent au plus ancien) */
  get posteActuel(): Affectation | null {
    return this.page === 0 && this.liste.length ? this.liste[0] : null;
  }

  goto(p: number) {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.load();
  }

  private load() {
    this.loading = true;
    this.error = false;
    this.errorMessage = 'Erreur de chargement';

    this.srv.listerMesAffectations(this.page, this.size, 'id,desc').subscribe({
      next: (resp: any) => {
        const body = resp?.body || {};
        this.liste = body.content || [];
        this.totalElements = body.totalElements ?? this.liste.length;
        this.totalPages = body.totalPages ?? 1;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = true;

        if (err?.status === 401) {
          this.errorMessage =
            'Vous devez être connecté en tant que personnel pour voir vos affectations.';
        } else {
          this.errorMessage =
            err?.error?.message || 'Une erreur est survenue lors du chargement de vos affectations.';
        }
      }
    });
  }

  /** Couleur douce par type de poste */
  badgePoste(label?: string): string {
    const v = (label || '').toLowerCase();
    if (v.includes('chef') || v.includes('responsable')) return 'bg-primary';
    if (v.includes('stagiaire') || v.includes('assist'))  return 'bg-info';
    if (v.includes('techn') || v.includes('dev'))         return 'bg-success';
    return 'bg-secondary';
  }
}

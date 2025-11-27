// src/app/rh/presence/mes-presences.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PresenceService } from '../services/presence.service';
import { DataStateEnum } from '../../state/state';
import { TitredepageComponent } from '../../commun/titredepage/titredepage.component';

@Component({
  standalone: true,
  selector: 'app-mes-presences',
  imports: [CommonModule, ReactiveFormsModule, TitredepageComponent],
  template: `
  <div class="container-fluid px-3 page-with-bg">
    <app-titredepage
      title="Mes présences"
      [items]="[{label:'RH'}, {label:'Mes présences', active:true}]">
    </app-titredepage>

    <div class="card">
      <div class="card-body">

        <!-- 🔹 Bloc synthèse situation actuelle -->
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <div class="border rounded-3 p-3 h-100 bg-light">
              <div class="small text-muted mb-1">Mois courant</div>
              <div class="fs-5 fw-semibold">
                {{ currentMonthLabel }} {{ currentYear }}
              </div>
              <div class="mt-2">
                <span class="small text-muted">Jours d'absence ce mois :</span>
                <div class="fs-4 fw-bold"
                     [class.text-success]="currentMonthAbsence === 0"
                     [class.text-warning]="currentMonthAbsence > 0">
                  {{ currentMonthAbsence }}
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="border rounded-3 p-3 h-100">
              <div class="small text-muted mb-1">Statut de validation</div>
              <div *ngIf="currentStatusLabel; else noData">
                <span class="badge"
                      [ngClass]="{
                        'bg-success': currentStatusType === 'ok',
                        'bg-warning': currentStatusType === 'pending',
                        'bg-secondary': currentStatusType === 'none'
                      }">
                  {{ currentStatusLabel }}
                </span>
                <div class="small text-muted mt-2" *ngIf="currentStatusDescription">
                  {{ currentStatusDescription }}
                </div>
              </div>
              <ng-template #noData>
                <div class="small text-muted">
                  Aucune feuille de présence enregistrée pour le mois courant.
                </div>
              </ng-template>
            </div>
          </div>

          <div class="col-md-4">
            <div class="border rounded-3 p-3 h-100">
              <div class="small text-muted mb-1">Vue annuelle</div>
              <div class="d-flex flex-column">
                <div>
                  <span class="small text-muted">Total jours d'absence {{ currentYear }} :</span>
                  <div class="fw-semibold">{{ totalAbsenceYear }}</div>
                </div>
                <div class="mt-2" *ngIf="lastUpdate">
                  <span class="small text-muted">Dernière mise à jour :</span>
                  <div class="fw-light">
                    {{ lastUpdate | date:'dd/MM/yyyy' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 🔹 Filtres -->
        <div class="d-flex flex-wrap gap-2 mb-3 align-items-end">
          <div>
            <label class="form-label">Mois</label>
            <select class="form-select form-select-sm" [formControl]="moisCtrl" (change)="rafraichir()">
              <option [ngValue]="null">— Tous —</option>
              <option *ngFor="let m of moisOptions" [ngValue]="m.value">
                {{ m.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="form-label">Année</label>
            <input type="number"
                   class="form-control form-control-sm"
                   [formControl]="anneeCtrl"
                   (change)="rafraichir()"
                   [min]="2000" [max]="2100">
          </div>
          <div class="ms-auto small text-muted">
            Total lignes : {{ totalElements }}
          </div>
        </div>

        <!-- 🔹 États de chargement -->
        <div *ngIf="state === dataStateEnum.CHARGEMENT" class="alert alert-info">
          Chargement de vos présences…
        </div>
        <div *ngIf="state === dataStateEnum.ERREUR" class="alert alert-danger">
          Erreur lors du chargement de vos présences. Veuillez réessayer plus tard.
        </div>

        <!-- 🔹 Tableau -->
        <div *ngIf="state === dataStateEnum.CHARGE" class="table-responsive">
          <table class="table table-striped align-middle">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Mois</th>
                <th>Année</th>
                <th>Jours absents</th>
                <th>Validation utilisateur</th>
                <th>Validation CSRH</th>
                <th>Date validation</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of liste; index as i">
                <td>{{ i + 1 + (page * size) }}</td>
                <td>{{ getMonthLabel(p?.mois) }}</td>
                <td>{{ p?.annee }}</td>
                <td>
                  <span [ngClass]="{
                          'fw-semibold text-success': p?.nbreJourAbsent === 0,
                          'fw-semibold text-warning': p?.nbreJourAbsent > 0
                        }">
                    {{ p?.nbreJourAbsent }}
                  </span>
                </td>
                <td>
                  <span class="badge"
                        [class.bg-success]="p?.userValidation"
                        [class.bg-secondary]="!p?.userValidation">
                    {{ p?.userValidation ? 'Validé' : 'En attente' }}
                  </span>
                </td>
                <td>
                  <span class="badge"
                        [class.bg-success]="p?.csrhValidation"
                        [class.bg-warning]="!p?.csrhValidation && p?.userValidation"
                        [class.bg-secondary]="!p?.csrhValidation && !p?.userValidation">
                    {{
                      p?.csrhValidation
                        ? 'Validé CSRH'
                        : (p?.userValidation ? 'En cours de validation' : 'Non validé')
                    }}
                  </span>
                </td>
                <td>{{ p?.dateValidation | date:'dd/MM/yyyy' }}</td>
              </tr>
              <tr *ngIf="!liste.length">
                <td colspan="7" class="text-center text-muted">
                  Aucune présence trouvée pour les filtres sélectionnés.
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 🔹 Pagination -->
          <div class="d-flex justify-content-end align-items-center" *ngIf="totalPages > 1">
            <button class="btn btn-outline-primary btn-sm me-2"
                    [disabled]="page===0"
                    (click)="goto(page-1)">
              Précédent
            </button>

            <ng-container *ngFor="let p of pages">
              <button class="btn btn-sm mx-1"
                      [class.btn-primary]="p===page"
                      [class.btn-outline-primary]="p!==page"
                      (click)="goto(p)">
                {{ p+1 }}
              </button>
            </ng-container>

            <button class="btn btn-outline-primary btn-sm ms-2"
                    [disabled]="page+1===totalPages"
                    (click)="goto(page+1)">
              Suivant
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
  `
})
export class MesPresencesComponent implements OnInit {
  dataStateEnum = DataStateEnum;
  state = DataStateEnum.CHARGEMENT;

  // 🔹 filtres
  moisCtrl = new FormControl<number | null>(null);
  anneeCtrl = new FormControl<number | null>(null);

  // Mois lisibles
  moisOptions = [
    { value: 1,  label: 'Janvier'   },
    { value: 2,  label: 'Février'   },
    { value: 3,  label: 'Mars'      },
    { value: 4,  label: 'Avril'     },
    { value: 5,  label: 'Mai'       },
    { value: 6,  label: 'Juin'      },
    { value: 7,  label: 'Juillet'   },
    { value: 8,  label: 'Août'      },
    { value: 9,  label: 'Septembre' },
    { value: 10, label: 'Octobre'   },
    { value: 11, label: 'Novembre'  },
    { value: 12, label: 'Décembre'  },
  ];

  // 🔹 données
  liste: any[] = [];
  page = 0;
  size = 10;
  sortField = 'dateValidation';
  sortDir: 'asc' | 'desc' = 'desc';
  totalElements = 0;
  totalPages = 0;
  pages: number[] = [];

  // 🔹 synthèse
  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();
  currentMonthAbsence = 0;
  currentStatusLabel: string | null = null;
  currentStatusType: 'ok' | 'pending' | 'none' = 'none';
  currentStatusDescription: string | null = null;
  totalAbsenceYear = 0;
  lastUpdate: Date | null = null;

  // ✅ nouvelle façon d'injecter le service (sans constructor)
  private presenceSrv = inject(PresenceService);

  ngOnInit(): void {
    this.load();
  }

  get currentMonthLabel(): string {
    return this.getMonthLabel(this.currentMonth);
  }

  getMonthLabel(mois?: number): string {
    if (!mois) { return ''; }
    const found = this.moisOptions.find(o => o.value === mois);
    return found ? found.label : String(mois);
  }

  rafraichir() {
    this.page = 0;
    this.load();
  }

  goto(p: number) {
    this.page = p;
    this.load();
  }

  private load() {
    this.state = DataStateEnum.CHARGEMENT;
    this.presenceSrv.listerMesPresences(this.page, this.size, this.sortField, this.sortDir)
      .subscribe({
        next: (resp: any) => {
          const body = resp?.body;
          let content = body?.content || [];

          // 🔹 filtres client sur mois / année
          const m = this.moisCtrl.value;
          const a = this.anneeCtrl.value;
          if (m != null) {
            content = content.filter((x: any) => Number(x?.mois) === Number(m));
          }
          if (a != null) {
            content = content.filter((x: any) => Number(x?.annee) === Number(a));
          }

          this.liste = content;
          this.totalElements = body?.totalElements ?? content.length;
          this.totalPages = body?.totalPages ?? 1;
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i);

          // 🔹 calcul synthèse UX
          this.computeSummary(content);

          this.state = DataStateEnum.CHARGE;
        },
        error: (_: any) => {
          this.state = DataStateEnum.ERREUR;
        }
      });
  }

  private computeSummary(content: any[]) {
    // ligne du mois courant
    const currentLine = content.find((p: any) =>
      Number(p?.mois) === this.currentMonth && Number(p?.annee) === this.currentYear
    );

    this.currentMonthAbsence = currentLine?.nbreJourAbsent ?? 0;

    if (!currentLine) {
      this.currentStatusLabel = null;
      this.currentStatusType = 'none';
      this.currentStatusDescription = null;
    } else {
      const userVal = !!currentLine.userValidation;
      const csrhVal = !!currentLine.csrhValidation;

      if (csrhVal) {
        this.currentStatusLabel = 'Présence validée par le CSRH';
        this.currentStatusType = 'ok';
        this.currentStatusDescription = this.currentMonthAbsence === 0
          ? 'Aucune absence déclarée pour ce mois.'
          : `Vous avez ${this.currentMonthAbsence} jour(s) d’absence validé(s) pour ce mois.`;
      } else if (userVal && !csrhVal) {
        this.currentStatusLabel = 'En cours de validation CSRH';
        this.currentStatusType = 'pending';
        this.currentStatusDescription = 'Votre feuille a été enregistrée et est en cours de validation par le CSRH.';
      } else {
        this.currentStatusLabel = 'Non validé';
        this.currentStatusType = 'none';
        this.currentStatusDescription = 'Votre feuille n’a pas encore été validée par le CSRH.';
      }
    }

    // total annuel des jours d’absence
    this.totalAbsenceYear = content
      .filter((p: any) => Number(p?.annee) === this.currentYear)
      .reduce((sum, p: any) => sum + (Number(p?.nbreJourAbsent) || 0), 0);

    // dernière date de validation
    const dates = content
      .map((p: any) => p?.dateValidation ? new Date(p.dateValidation) : null)
      .filter((d: any) => d instanceof Date && !isNaN(d.getTime())) as Date[];

    if (dates.length) {
      this.lastUpdate = dates.reduce((max, d) => d > max ? d : max, dates[0]);
    } else {
      this.lastUpdate = null;
    }
  }
}

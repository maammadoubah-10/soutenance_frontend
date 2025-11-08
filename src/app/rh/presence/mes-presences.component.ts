// src/app/rh/presence/mes-presences.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PresenceService } from '../services/presence.service';
import { DataStateEnum } from '../../state/state';
import { TitredepageComponent } from '../../commun/titredepage/titredepage.component';@Component({
  standalone: true,
  selector: 'app-mes-presences',
  imports: [CommonModule, ReactiveFormsModule, TitredepageComponent],
  template: `
  <div class="container-fluid px-3 page-with-bg">
    <app-titredepage title="Mes présences" [items]="[{label:'RH'}, {label:'Mes présences', active:true}]"></app-titredepage>

    <div class="card">
      <div class="card-body">

        <!-- Filtres minimalistes perso -->
        <div class="d-flex flex-wrap gap-2 mb-3">
          <div>
            <label class="form-label">Mois</label>
            <select class="form-select form-select-sm" [formControl]="moisCtrl" (change)="rafraichir()">
              <option [ngValue]="null">— Tous —</option>
              <option *ngFor="let m of moisList" [ngValue]="m">{{ m }}</option>
            </select>
          </div>
          <div>
            <label class="form-label">Année</label>
            <input type="number" class="form-control form-control-sm" [formControl]="anneeCtrl" (change)="rafraichir()" [min]="2000" [max]="2100">
          </div>
          <div class="ms-auto small text-muted">
            Total: {{ totalElements }}
          </div>
        </div>

        <div *ngIf="state === dataStateEnum.CHARGEMENT" class="alert alert-info">Chargement…</div>
        <div *ngIf="state === dataStateEnum.ERREUR" class="alert alert-danger">Erreur de chargement</div>

        <div *ngIf="state === dataStateEnum.CHARGE" class="table-responsive">
          <table class="table table-striped align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Mois</th>
                <th>Année</th>
                <th>Jours absents</th>
                <th>User validé</th>
                <th>CSRH validé</th>
                <th>Date validation</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of liste; index as i">
                <td>{{ i + 1 + (page * size) }}</td>
                <td>{{ p?.mois }}</td>
                <td>{{ p?.annee }}</td>
                <td>{{ p?.nbreJourAbsent }}</td>
                <td><span class="badge" [class.bg-success]="p?.userValidation" [class.bg-secondary]="!p?.userValidation">{{ p?.userValidation ? 'Oui' : 'Non' }}</span></td>
                <td><span class="badge" [class.bg-success]="p?.csrhValidation" [class.bg-danger]="!p?.csrhValidation">{{ p?.csrhValidation ? 'Oui' : 'Non' }}</span></td>
                <td>{{ p?.dateValidation | date:'dd/MM/yyyy' }}</td>
              </tr>
              <tr *ngIf="!liste.length">
                <td colspan="7" class="text-center">Aucune présence</td>
              </tr>
            </tbody>
          </table>

          <!-- pagination -->
          <div class="d-flex justify-content-end align-items-center" *ngIf="totalPages > 1">
            <button class="btn btn-outline-primary btn-sm me-2" [disabled]="page===0" (click)="goto(page-1)">Précédent</button>
            <ng-container *ngFor="let p of pages">
              <button class="btn btn-sm mx-1"
                      [class.btn-primary]="p===page"
                      [class.btn-outline-primary]="p!==page"
                      (click)="goto(p)">{{ p+1 }}</button>
            </ng-container>
            <button class="btn btn-outline-primary btn-sm ms-2" [disabled]="page+1===totalPages" (click)="goto(page+1)">Suivant</button>
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

  moisCtrl = new FormControl<number | null>(null);
  anneeCtrl = new FormControl<number | null>(null);
  moisList = [1,2,3,4,5,6,7,8,9,10,11,12];

  liste: any[] = [];
  page = 0; size = 10; sortField = 'id'; sortDir: 'asc'|'desc' = 'desc';
  totalElements = 0; totalPages = 0; pages: number[] = [];

  constructor(private presenceSrv: PresenceService) {}

  ngOnInit(): void { this.load(); }

  rafraichir() { this.page = 0; this.load(); }

  goto(p:number) { this.page = p; this.load(); }

  private load() {
    this.state = DataStateEnum.CHARGEMENT;
    this.presenceSrv.listerMesPresences(this.page, this.size, this.sortField, this.sortDir)
      .subscribe({
        next: (resp) => {
          const body = resp?.body;
          let content = body?.content || [];
          // filtres client (optionnels) sur mois/année si fournis
          const m = this.moisCtrl.value, a = this.anneeCtrl.value;
          if (m != null) content = content.filter((x:any)=> Number(x?.mois) === Number(m));
          if (a != null) content = content.filter((x:any)=> Number(x?.annee) === Number(a));

          this.liste = content;
          this.totalElements = body?.totalElements ?? content.length;
          this.totalPages = body?.totalPages ?? 1;
          this.pages = Array.from({length: this.totalPages}, (_,i)=>i);
          this.state = DataStateEnum.CHARGE;
        },
        error: _ => { this.state = DataStateEnum.ERREUR; }
      });
  }
}

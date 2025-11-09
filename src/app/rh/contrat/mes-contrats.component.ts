// src/app/rh/contrat/mes-contrats.component.ts
import { Component, OnInit, LOCALE_ID, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratService } from '../services/contrat.service';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-mes-contrats',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './mes-contrats.component.html',
  styleUrls: ['./mes-contrats.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
})
export class MesContratsComponent implements OnInit {
  // état UI
  loading = false;
  error   = '';
  tab     = signal<'tous' | 'actifs' | 'expires'>('tous');

  // données
  contrats: any[] = [];
  page = 0; size = 8; total = 0; totalPages = 0;

  constructor(
    private contratService: ContratService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  changeTab(t: 'tous' | 'actifs' | 'expires') {
    if (this.tab() === t) return;
    this.tab.set(t);
    this.page = 0;
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.error = '';
    let obs;

    if (this.tab() === 'tous') {
      obs = this.contratService.mesContrats(this.page, this.size, 'desc');
    } else if (this.tab() === 'actifs') {
      obs = this.contratService.contratsActifs(this.page, this.size, 'desc');
    } else {
      obs = this.contratService.contratsExpires(this.page, this.size, 'desc');
    }

    obs.subscribe({
      next: (resp: HttpResponse<any>) => {
        const body = resp.body;
        this.contrats    = body?.content ?? [];
        this.total       = body?.totalElements ?? 0;
        this.totalPages  = body?.totalPages ?? 0;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Impossible de charger les contrats';
        this.toastr.error(this.error, 'Erreur');
      }
    });
  }

  prev() { if (this.page > 0) { this.page--; this.fetch(); } }
  next() { if (this.page + 1 < this.totalPages) { this.page++; this.fetch(); } }

  // téléchargement PDF (réutilise ton endpoint)
  telecharger(contratId: number) {
    this.contratService.telechargerFichierContrat(contratId).subscribe({
      next: (data: ArrayBuffer) => {
        const now = new Date();
        const name = `contrat_${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.pdf`;
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = name; a.click();
        this.toastr.success('Contrat téléchargé', 'Succès');
      },
      error: () => this.toastr.error('Téléchargement impossible', 'Erreur'),
    });
  }

  // helpers safe
  safeDate(d?: string) {
    if (!d) return '';
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? '' : dt.toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
  }
}

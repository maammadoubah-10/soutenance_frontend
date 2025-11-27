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

  // Onglets : tous / actifs / expirés
  tab = signal<'tous' | 'actifs' | 'expires'>('tous');

  // données
  contrats: any[] = [];
  page = 0;
  size = 8;
  total = 0;
  totalPages = 0;

  // filtre simple sur la nature du contrat
  searchTerm = '';

  constructor(
    private contratService: ContratService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  /** Changer d'onglet */
  changeTab(t: 'tous' | 'actifs' | 'expires') {
    if (this.tab() === t) return;
    this.tab.set(t);
    this.page = 0;
    this.fetch();
  }

  /** Récupérer les contrats côté backend (mes contrats) */
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
        this.contrats   = body?.content ?? [];
        this.total      = body?.totalElements ?? this.contrats.length;
        this.totalPages = body?.totalPages ?? 1;
        this.loading    = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Impossible de charger les contrats';
        this.toastr.error(this.error, 'Erreur');
      }
    });
  }

  /** Pagination */
  prev() {
    if (this.page > 0) {
      this.page--;
      this.fetch();
    }
  }

  next() {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.fetch();
    }
  }

  /** Filtre front sur la nature du contrat */
  get filteredContrats(): any[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.contrats;

    return this.contrats.filter(c => {
      const nature = (c?.natureContrat || '').toLowerCase();
      const nomPers = (
        (c?.personnel?.etatCivil?.prenom || c?.personnel?.prenom || '') + ' ' +
        (c?.personnel?.etatCivil?.nom || c?.personnel?.nom || '')
      ).toLowerCase();
      return nature.includes(term) || nomPers.includes(term);
    });
  }

  /** STATUTS (même logique que côté admin) */

  private parseDate(dateLike: any): Date | null {
    if (!dateLike) return null;
    const d = new Date(dateLike);
    return isNaN(d.getTime()) ? null : d;
  }

  /** actif | expires | avenir | inconnu */
  private getStatusKey(c: any): 'actif' | 'expire' | 'avenir' | 'inconnu' {
    const debut = this.parseDate(c?.dateDebutContrat);
    const fin   = this.parseDate(c?.dateFinContrat);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (!debut && !fin) return 'inconnu';

    if (debut && debut > today) {
      return 'avenir';
    }

    if (fin && fin < today) {
      return 'expire';
    }

    return 'actif';
  }

  statusLabel(c: any): string {
    switch (this.getStatusKey(c)) {
      case 'actif':  return 'Contrat actif';
      case 'expire': return 'Contrat expiré';
      case 'avenir': return 'Contrat à venir';
      default:       return 'Statut non défini';
    }
  }

  statusBadgeClass(c: any): string {
    switch (this.getStatusKey(c)) {
      case 'actif':  return 'bg-success';
      case 'expire': return 'bg-danger';
      case 'avenir': return 'bg-warning text-dark';
      default:       return 'bg-secondary';
    }
  }

  statusHint(c: any): string {
    const today = new Date();
    today.setHours(0,0,0,0);
    const fin = this.parseDate(c?.dateFinContrat);
    const debut = this.parseDate(c?.dateDebutContrat);

    const key = this.getStatusKey(c);

    if (key === 'avenir' && debut) {
      const diff = Math.round((debut.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? `Commence dans ${diff} jour(s)` : '';
    }

    if (key === 'actif' && fin) {
      const diff = Math.round((fin.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 0) return `Expire dans ${diff} jour(s)`;
      if (diff === 0) return `Expire aujourd'hui`;
    }

    if (key === 'expire' && fin) {
      const diff = Math.round((today.getTime() - fin.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? `Expiré il y a ${diff} jour(s)` : 'Contrat expiré';
    }

    return '';
  }

  /** Petites stats pour la synthèse */
  get nbActifs(): number {
    return this.contrats.filter(c => this.getStatusKey(c) === 'actif').length;
  }

  get nbExpires(): number {
    return this.contrats.filter(c => this.getStatusKey(c) === 'expire').length;
  }

  get nbAvenir(): number {
    return this.contrats.filter(c => this.getStatusKey(c) === 'avenir').length;
  }

  /** téléchargement PDF (réutilise ton endpoint) */
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

  // helper date lisible
  safeDate(d?: string) {
    if (!d) return '';
    const dt = new Date(d);
    return isNaN(dt.getTime())
      ? ''
      : dt.toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
  }

  get fullName(): (c: any) => string {
    return (c: any) => {
      if (!c?.personnel) return '';
      const prenom = c?.personnel?.etatCivil?.prenom || c?.personnel?.prenom || '';
      const nom    = c?.personnel?.etatCivil?.nom    || c?.personnel?.nom    || '';
      return `${prenom} ${nom}`.trim();
    };
  }
}

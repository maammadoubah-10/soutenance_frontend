import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { HttpResponse } from '@angular/common/http';
import { MissionService } from '../services/mission.service';
import { TitredepageComponent } from '../../commun/titredepage/titredepage.component';

@Component({
  standalone: true,
  selector: 'app-mes-missions',
  imports: [CommonModule, TitredepageComponent],
  templateUrl: './mes-missions.component.html'
})
export class MesMissionsComponent implements OnInit {
  items = [
    { label: 'Ressources Humaines' },
    { label: 'Mes Missions', active: true }
  ];

  liste: any[] = [];
  total = 0;
  totalPages = 0;
  pages: number[] = [];
  page = 0;
  size = 10;
  sort = 'desc';
  loading = false;
  error = false;

  constructor(private missionSrv: MissionService) {}

  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    this.load();
  }

  load() {
    this.loading = true; this.error = false;
    this.missionSrv.listerMesMissions(this.page, this.size, this.sort).subscribe({
      next: (resp: HttpResponse<any>) => {
        const body = resp.body || {};
        this.liste = (body.content || []).map((m: any) => this.hydrate(m));
        this.total = body.totalElements || 0;
        this.totalPages = body.totalPages || 0;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
        this.loading = false;
      },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  hydrate(m: any) {
    const start = m.dateDebut ? new Date(m.dateDebut) : null;
    const end   = m.dateFin ? new Date(m.dateFin) : null;
    const today = new Date();
    const inProgress = !!(start && end && start <= today && end >= today);

    return {
      id: m.id,
      reference: m.reference || '',
      nbreJour: m.nbreJour,
      dateDebut: m.dateDebut,
      dateFin: m.dateFin,
      motif: m.motif || '',
      moyenDeplacement: m.moyenDeplacement || '',
      pieces: m.pieces || null,
      inProgress
    };
  }

  statutBadge(item: any) {
    if (item.inProgress) return { cls: 'badge bg-success-subtle text-success', txt: 'En cours' };
    if (item.dateFin)    return { cls: 'badge bg-danger-subtle text-danger',  txt: 'Terminée' };
    return { cls: 'badge bg-secondary-subtle text-secondary', txt: '—' };
  }

  dlPieces(item: any) {
    window.open(`${this.missionSrv.contextPath}/${item.id}/telecharger`, '_blank');
  }

  goto(p: number) { if (p>=0 && p<this.totalPages) { this.page = p; this.load(); } }
  prev() { this.goto(this.page - 1); }
  next() { this.goto(this.page + 1); }
}

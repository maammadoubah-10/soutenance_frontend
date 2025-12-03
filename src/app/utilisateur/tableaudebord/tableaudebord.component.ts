import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataStateEnum, ModelDataState } from '../../state/state';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilisateurAuthentifie } from '../../authentification/models/utilisateur-authentifie';
import { UtilisateurService } from '../services/utilisateur.service';
import { AuthentificationService } from '../../authentification/services/authentication.service';

import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexStroke,
  ApexPlotOptions,
  ApexFill,
  ApexTooltip,
  ApexLegend,
  ApexGrid,
  ApexResponsive
} from 'ng-apexcharts';

export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  legend: ApexLegend;
  colors?: string[];
};

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
};

export type RadialChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  colors?: string[];
};

@Component({
  selector: 'app-tableaudebord',
  templateUrl: './tableaudebord.component.html',
  styleUrls: ['./tableaudebord.component.scss']
})
export class TableaudebordComponent implements OnInit {
  items: any[] = [];

  dataStateEnum = DataStateEnum;
  profilSrc: any;
  utilisateurAuthentifie: any;

  statistiqueTb: any;
  utilisateurAuthentifieState$?: Observable<ModelDataState<UtilisateurAuthentifie>>;

  // Charts
  usersAreaChart!: AreaChartOptions;
  activationRadialChart!: RadialChartOptions;
  rolesDonutChart!: DonutChartOptions;
  permissionsBarChart!: BarChartOptions;

  constructor(
    private sanitizer: DomSanitizer,
    private utilisateurService: UtilisateurService,
    private authenficationSerice: AuthentificationService
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'Utilisateurs' },
      { label: 'Tableau de bord', active: true }
    ];

    this.initCharts();
    this.obtenirUnUtilisateurParEmail();
    this.obtenunirStatistique();
  }

  /** ====== Getters pour l’affichage propre du header ====== */
  get displayName(): string {
    const u = this.utilisateurAuthentifie;
    const first = u?.personnel?.prenom || u?.prenom || '';
    const last = u?.personnel?.nom || u?.nom || '';
    const full = (first + ' ' + last).trim();
    // Si aucun nom/prénom → on affiche l’email, sinon "Utilisateur"
    return full || u?.email || 'Utilisateur';
  }

  get jobTitle(): string {
    return (
      this.utilisateurAuthentifie?.personnel?.poste?.designation ||
      'Compte administrateur'
    );
  }

  get serviceName(): string {
    return (
      this.utilisateurAuthentifie?.personnel?.poste?.service?.designation ||
      'Service non renseigné'
    );
  }

  get emailDisplay(): string {
    return this.utilisateurAuthentifie?.email || '';
  }

  /** Initiales de l’avatar (2 lettres) */
  get avatarInitials(): string {
    const base =
      this.utilisateurAuthentifie?.personnel?.prenom ||
      this.utilisateurAuthentifie?.prenom ||
      this.utilisateurAuthentifie?.email ||
      'U';
    return base.substring(0, 2).toUpperCase();
  }

  /** Normalisation des données utilisateur (nom/prénom depuis etatCivil si besoin) */
  private normalizeUserAuth(u: any): any {
    const pers = u?.personnel ?? {};
    const ec = pers?.etatCivil ?? {};

    const persoNom = pers?.nom ?? ec?.nom ?? null;
    const persoPrenom = pers?.prenom ?? ec?.prenom ?? null;

    return {
      ...u,
      personnel: {
        ...pers,
        nom: persoNom,
        prenom: persoPrenom
      }
    };
  }

  // -------- DATA --------
  creationImage(image: Blob) {
    if (image && image.size > 0) {
      const objectURL = URL.createObjectURL(image);
      this.profilSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }
  }

  private afficherImageDeProfil(image_de_profil: string | null | undefined): void {
    if (!image_de_profil) return;
    const obs = this.authenficationSerice.recuperationDeImageDeProfil(image_de_profil);
    if (!obs) return;

    obs.subscribe({
      next: (blob: Blob) => this.creationImage(blob),
      error: () => {}
    });
  }

  obtenirUnUtilisateurParEmail() {
    this.utilisateurAuthentifieState$ = this.authenficationSerice
      .obtenirUnUtilisateurParEmail('')
      .pipe(
        map((data) => {
          const normalise = this.normalizeUserAuth(data);
          this.utilisateurAuthentifie = normalise;
          this.afficherImageDeProfil(normalise?.image_de_profil);
          return { data: normalise, dataState: DataStateEnum.CHARGE };
        }),
        startWith({ dataState: DataStateEnum.CHARGEMENT }),
        catchError((error: HttpErrorResponse) =>
          this.authenficationSerice.gestionnaireDerreur(error)
        )
      );
  }

 obtenunirStatistique() {
  this.utilisateurService.afficherLesStatistiquesUtilisateurs()
    .subscribe((response) => {
      this.statistiqueTb = response;      // plus besoin de Array.isArray(...)
      this.updateChartsFromStats();
    });
}


  // -------- CHARTS --------
  private initCharts() {
    const total = 120;
    const actifs = 95;
    const taux = total ? Math.round((actifs / total) * 100) : 0;

    this.usersAreaChart = {
      series: [
        { name: 'Actifs', data: [12, 14, 15, 16, 17, 18, 19] },
        { name: 'Inactifs', data: [3, 4, 3, 5, 4, 5, 4] }
      ],
      chart: { type: 'area', height: 320, toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient', gradient: { opacityFrom: 0.5, opacityTo: 0.2 } },
      xaxis: { categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] },
      grid: { strokeDashArray: 4 },
      tooltip: { theme: 'light' },
      legend: { position: 'top' }
    };

    this.activationRadialChart = {
      series: [taux],
      chart: { type: 'radialBar', height: 320 },
      labels: ['Taux activation'],
      plotOptions: {
        radialBar: {
          hollow: { size: '60%' },
          dataLabels: {
            name: { fontSize: '14px' },
            value: { fontSize: '24px', formatter: (v: any) => `${v}%` }
          }
        }
      },
      fill: { type: 'gradient', gradient: { shade: 'light', opacityFrom: 0.9, opacityTo: 0.6 } },
      tooltip: { enabled: true }
    };

    this.rolesDonutChart = {
      series: [50, 30, 20],
      chart: { type: 'donut', height: 320 },
      labels: ['Admin', 'Manager', 'Utilisateur'],
      legend: { position: 'bottom' },
      responsive: [
        { breakpoint: 992, options: { legend: { position: 'bottom' } } }
      ],
      tooltip: { y: { formatter: (val: number) => `${val}` } }
    };

    this.permissionsBarChart = {
      series: [{ name: 'Permissions', data: [12, 9, 15, 6, 10] }],
      chart: { type: 'bar', height: 320, toolbar: { show: false } },
      plotOptions: { bar: { columnWidth: '40%', borderRadius: 6 } },
      dataLabels: { enabled: false },
      xaxis: { categories: ['RH', 'Paie', 'Utilisateurs', 'Formation', 'Publication'] },
      yaxis: { labels: { show: true } },
      grid: { strokeDashArray: 4 },
      tooltip: { theme: 'light' }
    };
  }

  private updateChartsFromStats() {
    const total = Number(this.statistiqueTb?.nombreTotalUtilisateur ?? 0);
    const actifs = Number(this.statistiqueTb?.nombreTotalUtilisateurActif ?? 0);
    const inactifs = Number(this.statistiqueTb?.nombreTotalUtilisateurNonActif ?? 0);
    const roles = Number(this.statistiqueTb?.nombreTotalRole ?? 0);
    const perms = Number(this.statistiqueTb?.nombreTotalPermission ?? 0);

    const admin = Math.max(1, Math.round(roles * 0.2));
    const manager = Math.max(1, Math.round(roles * 0.3));
    const user = Math.max(1, roles - admin - manager);

    this.usersAreaChart = {
      ...this.usersAreaChart,
      series: [
        { name: 'Actifs', data: this.buildSmoothSeries(actifs) },
        { name: 'Inactifs', data: this.buildSmoothSeries(inactifs) }
      ]
    };

    const taux = total ? Math.round((actifs / total) * 100) : 0;
    this.activationRadialChart = { ...this.activationRadialChart, series: [taux] };

    this.rolesDonutChart = {
      ...this.rolesDonutChart,
      series: [admin, manager, user],
      labels: ['Admin', 'Manager', 'Utilisateur'],
      responsive: this.rolesDonutChart.responsive ?? []
    };

    const repartitionPerm = this.distributeNumberAcross(5, perms);
    this.permissionsBarChart = {
      ...this.permissionsBarChart,
      series: [{ name: 'Permissions', data: repartitionPerm }]
    };
  }

  private buildSmoothSeries(value: number): number[] {
    const base = Math.max(0, Math.floor(value * 0.8));
    const delta = Math.max(0, value - base);
    return [base - 2, base + 1, base + 2, base + 3, base + delta - 1, base + delta, value];
  }

  private distributeNumberAcross(n: number, total: number): number[] {
    if (n <= 0) return [];
    const base = Math.floor(total / n);
    const arr = Array(n).fill(base);
    let rest = total - base * n;
    let i = 0;
    while (rest > 0) {
      arr[i % n]++;
      rest--;
      i++;
    }
    return arr;
  }
}

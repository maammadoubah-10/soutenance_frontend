import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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
import { RhDashboardDto, RhDashboardService } from './services/rh-dashboard.service';
import { AuthentificationService } from '../authentification/services/authentication.service';

/** ===== Types pour ng-apexcharts ===== **/
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
  legend: ApexLegend;
  colors?: string[];
};

@Component({
  selector: 'app-rh-dashboard',
  templateUrl: './rh-dashboard.component.html'
})
export class RhDashboardComponent implements OnInit {

  /** ===== Rôle ===== */
  isAdmin = false;

  /** ===== KPI ADMIN ===== */
  kpi = {
    totalPersonnel: 0,
    postesOuverts: 0,
    enAbsence: 0,
    tauxTurnover: 0
  };

  /** ===== KPI PERSONNEL ===== */
  persoKpi = {
    contratActif: false,
    soldeConges: 0,
    presencesMois: 0,
    missionsEnCours: 0
  };

  /** ===== Charts ADMIN ===== */
  headcountArea!: AreaChartOptions;
  hiresDeparturesBar!: BarChartOptions;
  departmentsDonut!: DonutChartOptions;

  /** ===== Charts COMMUNS / PERSONNEL ===== */
  presenceArea!: AreaChartOptions;
  missionsCongesBar!: BarChartOptions;
  absenceRadial!: RadialChartOptions;

  /** ===== UI state ===== */
  loading = false;
  errorMsg = '';

  constructor(
    private api: RhDashboardService,
    private auth: AuthentificationService
  ) {}

  ngOnInit(): void {
    // Détermine le rôle (sans bloquer l’affichage)
    this.isAdmin = this.auth.isAdmin();

    // Initialise tous les graphs avec des valeurs sûres
    this.initChartsDefaults();

    // Charge les données (endpoint différent selon rôle)
    this.fetchData();
  }

  /** Initialisation des options par défaut pour TOUTES les cartes */
  private initChartsDefaults(): void {
    // Area (admin: headcount, perso: presence)
    const areaDefault: AreaChartOptions = {
      series: [{ name: 'Série', data: [] }],
      chart: { type: 'area', height: 320, toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient', gradient: { opacityFrom: 0.45, opacityTo: 0.15 } },
      xaxis: { categories: [] },
      grid: { strokeDashArray: 4 },
      tooltip: { theme: 'light' },
      legend: { position: 'top' }
    };
    this.headcountArea = { ...areaDefault, series: [{ name: 'Effectif', data: [] }] };
    this.presenceArea  = { ...areaDefault, series: [{ name: 'Présent',  data: [] }] };

    // Bar (admin: hires/departures, perso: missions/congés)
    const barDefault: BarChartOptions = {
      series: [{ name: 'Série', data: [] }],
      chart: { type: 'bar', height: 320, stacked: false, toolbar: { show: false } },
      plotOptions: { bar: { columnWidth: '45%', borderRadius: 6 } },
      dataLabels: { enabled: false },
      xaxis: { categories: [] },
      yaxis: { labels: { show: true } },
      grid: { strokeDashArray: 4 },
      tooltip: { theme: 'light' },
      legend: { position: 'top' }
    };
    this.hiresDeparturesBar = { ...barDefault, series: [
      { name: 'Entrées', data: [] },
      { name: 'Sorties', data: [] }
    ]};
    this.missionsCongesBar = { ...barDefault, series: [
      { name: 'Missions', data: [] },
      { name: 'Congés',   data: [] }
    ]};

    // Radial (commun)
    this.absenceRadial = {
      series: [0],
      chart: { type: 'radialBar', height: 320 },
      labels: [ this.isAdmin ? 'Taux d’absence' : 'Absence (mois)' ],
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

    // Donut (admin – répartition par service)
    this.departmentsDonut = {
      series: [],
      chart: { type: 'donut', height: 320 },
      labels: [],
      legend: { position: 'bottom' },
      responsive: [{ breakpoint: 992, options: { legend: { position: 'bottom' } } }],
      tooltip: { y: { formatter: (val: number) => `${val}` } }
    };
  }

  /** Appel API selon rôle et mapping */
  private fetchData(): void {
    this.loading = true;
    this.errorMsg = '';

    const obs = this.isAdmin ? this.api.getDashboard() : this.api.getMyDashboard();

    obs.subscribe({
      next: (res: RhDashboardDto) => {
        if (this.isAdmin) {
          // ====== ADMIN ======
          this.kpi = {
            totalPersonnel: res?.kpi?.totalPersonnel ?? 0,
            postesOuverts:  res?.kpi?.postesOuverts  ?? 0,
            enAbsence:      res?.kpi?.enAbsence      ?? 0,
            tauxTurnover:   Math.round((res?.kpi?.tauxTurnover ?? 0) * 10) / 10
          };

          this.headcountArea = {
            ...this.headcountArea,
            xaxis: { categories: res?.headcount?.labels ?? [] },
            series: [{ name: 'Effectif', data: (res?.headcount?.data ?? []).map(Number) }]
          };

          this.hiresDeparturesBar = {
            ...this.hiresDeparturesBar,
            xaxis: { categories: res?.hiresDepartures?.labels ?? [] },
            series: [
              { name: 'Entrées',   data: (res?.hiresDepartures?.hires ?? []).map(Number) },
              { name: 'Sorties',   data: (res?.hiresDepartures?.departures ?? []).map(Number) }
            ]
          };

          this.absenceRadial = {
            ...this.absenceRadial,
            labels: ['Taux d’absence'],
            series: [Math.round((res?.absence?.rate ?? 0) * 10) / 10]
          };

          this.departmentsDonut = {
            ...this.departmentsDonut,
            labels: res?.departments?.labels ?? [],
            series: (res?.departments?.values ?? []).map(Number)
          };
        } else {
          // ====== PERSONNEL ======
          this.persoKpi = {
            contratActif:    (res?.kpi?.totalPersonnel ?? 0) > 0,
            soldeConges:     res?.kpi?.postesOuverts  ?? 0,
            presencesMois:   res?.kpi?.enAbsence      ?? 0,
            missionsEnCours: Math.round(res?.kpi?.tauxTurnover ?? 0)
          };

          this.presenceArea = {
            ...this.presenceArea,
            xaxis: { categories: res?.headcount?.labels ?? [] },
            series: [{ name: 'Présent', data: (res?.headcount?.data ?? []).map(Number) }]
          };

          this.missionsCongesBar = {
            ...this.missionsCongesBar,
            xaxis: { categories: res?.hiresDepartures?.labels ?? [] },
            series: [
              { name: 'Missions', data: (res?.hiresDepartures?.hires ?? []).map(Number) },
              { name: 'Congés',   data: (res?.hiresDepartures?.departures ?? []).map(Number) }
            ]
          };

          this.absenceRadial = {
            ...this.absenceRadial,
            labels: ['Absence (mois)'],
            series: [Math.round((res?.absence?.rate ?? 0) * 10) / 10]
          };
          // Le donut personnel réutilise departments comme "types de congés"
          this.departmentsDonut = {
            ...this.departmentsDonut,
            labels: res?.departments?.labels ?? [],
            series: (res?.departments?.values ?? []).map(Number)
          };
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = err?.error?.message || 'Erreur lors du chargement du tableau de bord.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

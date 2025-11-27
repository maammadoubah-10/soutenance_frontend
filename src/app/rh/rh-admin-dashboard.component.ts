// src/app/rh/rh-admin-dashboard.component.ts
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

import {
  RhDashboardDto,
  RhDashboardService,
  AdminAlert
}  from './services/rh-dashboard.service';


// ==== Types pour les graphiques ====
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

@Component({
  selector: 'app-rh-admin-dashboard',
  templateUrl: './rh-admin-dashboard.component.html'
})
export class RhAdminDashboardComponent implements OnInit {

  /** ===== KPI ADMIN ===== */
  kpi = {
    totalEmployes: 0,
    nouveauxEntrants30Jours: 0,
    tauxAbsentismeMois: 0,
    postesVacants: 0
  };

  /** ===== Graphiques ===== */
  effectifArea!: AreaChartOptions;         // Évolution de l’effectif
  absenceRadial!: RadialChartOptions;      // Taux d’absentéisme
  departementsDonut!: DonutChartOptions;   // Répartition par service

  /** ===== Alertes RH temps réel ===== */
  alertes: AdminAlert[] = [];

  /** ===== UI state ===== */
  loading = false;
  errorMsg = '';

  constructor(
    private api: RhDashboardService
  ) {}

  ngOnInit(): void {
    this.initChartsDefaults();
    this.fetchAdminDashboard();
  }

  /** Initialisation des options par défaut */
  private initChartsDefaults(): void {
    // ---- Area : effectif ----
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

    this.effectifArea = {
      ...areaDefault,
      series: [{ name: 'Effectif', data: [] }]
    };

    // ---- Radial : taux d’absentéisme ----
    this.absenceRadial = {
      series: [0],
      chart: { type: 'radialBar', height: 320 },
      labels: ['Taux d’absence'],
      plotOptions: {
        radialBar: {
          hollow: { size: '60%' },
          dataLabels: {
            name: { fontSize: '14px' },
            value: {
              fontSize: '24px',
              formatter: (v: any) => `${v}%`
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          opacityFrom: 0.9,
          opacityTo: 0.6
        }
      },
      tooltip: { enabled: true }
    };

    // ---- Donut : répartition par service ----
    this.departementsDonut = {
      series: [],
      chart: { type: 'donut', height: 320 },
      labels: [],
      legend: { position: 'bottom' },
      responsive: [
        {
          breakpoint: 992,
          options: { legend: { position: 'bottom' } }
        }
      ],
      tooltip: { y: { formatter: (val: number) => `${val}` } }
    };
  }

  /** Récupération des données admin (KPI + charts + alertes) */
  private fetchAdminDashboard(): void {
    this.loading = true;
    this.errorMsg = '';

    this.api.getDashboard().subscribe({
      next: (res: RhDashboardDto) => {
        // ==== Mapping des KPI ====
        const totalPersonnel = res?.kpi?.totalPersonnel ?? 0;
        const postesOuverts  = res?.kpi?.postesOuverts  ?? 0;
        const nbAbsents      = res?.kpi?.enAbsence      ?? 0;
        const tauxTurnover   = res?.kpi?.tauxTurnover   ?? 0;
        const tauxAbs        = res?.absence?.rate       ?? 0;

        this.kpi = {
          totalEmployes: totalPersonnel,
          // on approxime les nouveaux entrants par la somme des hires sur la période
          nouveauxEntrants30Jours: (res?.hiresDepartures?.hires ?? []).reduce(
            (acc, v) => acc + (Number(v) || 0),
            0
          ),
          tauxAbsentismeMois: Math.round(tauxAbs * 10) / 10,
          postesVacants: postesOuverts
        };

        // ==== Courbe : évolution effectif ====
        this.effectifArea = {
          ...this.effectifArea,
          xaxis: { categories: res?.headcount?.labels ?? [] },
          series: [
            {
              name: 'Effectif',
              data: (res?.headcount?.data ?? []).map(Number)
            }
          ]
        };

        // ==== Radial : taux d’absence ====
        this.absenceRadial = {
          ...this.absenceRadial,
          labels: ['Taux d’absence'],
          series: [Math.round(tauxAbs * 10) / 10]
        };

        // ==== Donut : répartition par service ====
        this.departementsDonut = {
          ...this.departementsDonut,
          labels: res?.departments?.labels ?? [],
          series: (res?.departments?.values ?? []).map(Number)
        };

        // ==== Alertes RH temps réel ====
        this.alertes = res.alertes ?? [];
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg =
          err?.error?.message ||
          'Erreur lors du chargement du tableau de bord RH administrateur.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

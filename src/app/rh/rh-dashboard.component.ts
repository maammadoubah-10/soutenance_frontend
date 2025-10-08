import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
//import { RhDashboardService, RhDashboardDto } from './services/rh-dashboard.service';
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
//import { RhDashboardService, RhDashboardDto } from './rh-dashboard.service';

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

  /** ===== KPI ===== */
  kpi = {
    totalPersonnel: 0,
    postesOuverts: 0,
    enAbsence: 0,
    tauxTurnover: 0
  };

  /** ===== Charts ===== */
  headcountArea!: AreaChartOptions;
  hiresDeparturesBar!: BarChartOptions;
  absenceRadial!: RadialChartOptions;
  departmentsDonut!: DonutChartOptions;

  /** ===== UI state ===== */
  loading = false;
  errorMsg = '';

  constructor(private api: RhDashboardService) {}

  ngOnInit(): void {
    this.initChartsWithDefaults();
    this.fetchData();
  }

  /** 1) INIT défauts (sécurise les inputs) */
  private initChartsWithDefaults(): void {
    this.headcountArea = {
      series: [{ name: 'Effectif', data: [] }],
      chart: { type: 'area', height: 320, toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient', gradient: { opacityFrom: 0.45, opacityTo: 0.15 } },
      xaxis: { categories: [] },
      grid: { strokeDashArray: 4 },
      tooltip: { theme: 'light' },
      legend: { position: 'top' }
    };

    this.hiresDeparturesBar = {
      series: [
        { name: 'Entrées', data: [] },
        { name: 'Sorties', data: [] }
      ],
      chart: { type: 'bar', height: 320, stacked: false, toolbar: { show: false } },
      plotOptions: { bar: { columnWidth: '45%', borderRadius: 6 } },
      dataLabels: { enabled: false },
      xaxis: { categories: [] },
      yaxis: { labels: { show: true } },
      grid: { strokeDashArray: 4 },
      tooltip: { theme: 'light' },
      legend: { position: 'top' }
    };

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
      fill: { type: 'gradient', gradient: { shade: 'light', opacityFrom: 0.9, opacityTo: 0.6 } },
      tooltip: { enabled: true }
    };

    this.departmentsDonut = {
      series: [],
      chart: { type: 'donut', height: 320 },
      labels: [],
      legend: { position: 'bottom' },
      responsive: [{ breakpoint: 992, options: { legend: { position: 'bottom' } } }],
      tooltip: { y: { formatter: (val: number) => `${val}` } }
    };
  }

  /** 2) Chargement réel depuis le backend */
  private fetchData(): void {
    this.loading = true;
    this.errorMsg = '';

    this.api.getDashboard().subscribe({
      next: (res: RhDashboardDto) => {
        // KPI
        this.kpi = {
          totalPersonnel: res?.kpi?.totalPersonnel ?? 0,
          postesOuverts:  res?.kpi?.postesOuverts  ?? 0,
          enAbsence:      res?.kpi?.enAbsence      ?? 0,
          tauxTurnover:   Math.round((res?.kpi?.tauxTurnover ?? 0) * 10) / 10
        };

        // Effectif (area)
        this.headcountArea = {
          ...this.headcountArea,
          xaxis: { categories: res?.headcount?.labels ?? [] },
          series: [{ name: 'Effectif', data: res?.headcount?.data ?? [] }]
        };

        // Entrées / Sorties (bar)
        this.hiresDeparturesBar = {
          ...this.hiresDeparturesBar,
          xaxis: { categories: res?.hiresDepartures?.labels ?? [] },
          series: [
            { name: 'Entrées',   data: res?.hiresDepartures?.hires ?? [] },
            { name: 'Sorties',   data: res?.hiresDepartures?.departures ?? [] }
          ]
        };

        // Absence (radial)
        this.absenceRadial = {
          ...this.absenceRadial,
          series: [Math.round((res?.absence?.rate ?? 0) * 10) / 10]
        };

        // Répartition par service (donut)
        this.departmentsDonut = {
          ...this.departmentsDonut,
          labels: res?.departments?.labels ?? [],
          series: res?.departments?.values ?? []
        };
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

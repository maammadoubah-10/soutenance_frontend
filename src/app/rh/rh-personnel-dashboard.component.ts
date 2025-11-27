// src/app/rh/rh-personnel-dashboard.component.ts
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

//import { RhDashboardDto, RhDashboardService } from '../rh-dashboard/services/rh-dashboard.service';

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
  selector: 'app-rh-personnel-dashboard',
  templateUrl: './rh-personnel-dashboard.component.html'
})
export class RhPersonnelDashboardComponent implements OnInit {

  /** ===== KPI PERSONNEL (adapté au backend) ===== */
  persoKpi = {
    contratActif: false,
    soldeConges: 0,
    presencesMois: 0,
    missionsEnCours: 0
  };

  /** ===== Charts PERSONNEL ===== */
  presenceArea!: AreaChartOptions;
  missionsCongesBar!: BarChartOptions;
  absenceRadial!: RadialChartOptions;
  departmentsDonut!: DonutChartOptions;

  /** ===== UI state ===== */
  loading = false;
  errorMsg = '';

  constructor(
    private api: RhDashboardService
  ) {}

  ngOnInit(): void {
    this.initChartsDefaults();
    this.fetchPersonnelDashboard();
  }

  /** Config par défaut des charts */
  private initChartsDefaults(): void {
    const areaDefault: AreaChartOptions = {
      series: [{ name: 'Série', data: [] }],
      chart: { type: 'area', height: 320, toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient', gradient: { opacityFrom: 0.45, opacityTo: 0.15 } as any },
      xaxis: { categories: [] },
      grid: { strokeDashArray: 4 },
      tooltip: { theme: 'light' },
      legend: { position: 'top' }
    };
    this.presenceArea  = {
      ...areaDefault,
      series: [{ name: 'Présent',  data: [] }]
    };

    const barDefault: BarChartOptions = {
      series: [{ name: 'Série', data: [] }],
      chart: { type: 'bar', height: 320, stacked: false, toolbar: { show: false } },
      plotOptions: { bar: { columnWidth: '45%', borderRadius: 6 } } as any,
      dataLabels: { enabled: false },
      xaxis: { categories: [] },
      yaxis: { labels: { show: true } },
      grid: { strokeDashArray: 4 },
      tooltip: { theme: 'light' },
      legend: { position: 'top' }
    };
    this.missionsCongesBar = {
      ...barDefault,
      series: [
        { name: 'Missions', data: [] },
        { name: 'Congés',   data: [] }
      ]
    };

    this.absenceRadial = {
      series: [0],
      chart: { type: 'radialBar', height: 320 },
      labels: ['Absence (mois)'],
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
      } as any,
      fill: {
        type: 'gradient',
        gradient: { shade: 'light', opacityFrom: 0.9, opacityTo: 0.6 } as any
      },
      tooltip: { enabled: true }
    };

    this.departmentsDonut = {
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
      tooltip: { y: { formatter: (val: number) => `${val}` } } as any
    };
  }

  /** Appel API backend /dashboard/moi */
  private fetchPersonnelDashboard(): void {
    this.loading = true;
    this.errorMsg = '';

    this.api.getMyDashboard().subscribe({
      next: (res: RhDashboardDto) => {

        // ===== Mapping DTO backend → persoKpi =====
        this.persoKpi = {
          contratActif:    (res?.kpi?.totalPersonnel ?? 0) > 0,
          soldeConges:     res?.kpi?.postesOuverts  ?? 0,
          presencesMois:   res?.kpi?.enAbsence      ?? 0,
          missionsEnCours: Math.round(res?.kpi?.tauxTurnover ?? 0)
        };

        // ===== Courbe Présence =====
        this.presenceArea = {
          ...this.presenceArea,
          xaxis: { categories: res?.headcount?.labels ?? [] },
          series: [
            { name: 'Présent', data: (res?.headcount?.data ?? []).map(Number) }
          ]
        };

        // ===== Bar Missions vs Congés =====
        this.missionsCongesBar = {
          ...this.missionsCongesBar,
          xaxis: { categories: res?.hiresDepartures?.labels ?? [] },
          series: [
            { name: 'Missions', data: (res?.hiresDepartures?.hires ?? []).map(Number) },
            { name: 'Congés',   data: (res?.hiresDepartures?.departures ?? []).map(Number) }
          ]
        };

        // ===== Radial Taux d’absence =====
        const tauxAbs = res?.absence?.rate ?? 0;
        this.absenceRadial = {
          ...this.absenceRadial,
          labels: ['Absence (mois)'],
          series: [Math.round(tauxAbs * 10) / 10]
        };

        // ===== Donut Types de congés =====
        this.departmentsDonut = {
          ...this.departmentsDonut,
          labels: res?.departments?.labels ?? [],
          series: (res?.departments?.values ?? []).map(Number)
        };
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = err?.error?.message || 'Erreur lors du chargement de mon tableau de bord.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

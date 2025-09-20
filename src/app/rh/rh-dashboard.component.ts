import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// Types ng-apexcharts (v1.x)
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

/** ===== Types où tout ce qui est lié dans le template est défini (pas d'undefined) ===== **/
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
  responsive: ApexResponsive[]; // toujours défini
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
  legend: ApexLegend;   // ✅ obligatoire
  colors?: string[];
};


@Component({
  selector: 'app-rh-dashboard',
  templateUrl: './rh-dashboard.component.html',
  //styleUrls: ['./rh-dashboard.component.scss']
})
export class RhDashboardComponent implements OnInit {

  /** ===== KPI (mock par défaut, remplacables par API) ===== */
  kpi = {
    totalPersonnel: 0,
    postesOuverts: 0,
    enAbsence: 0,
    tauxTurnover: 0   // en %
  };

  /** ===== CHART OPTIONS ===== */
  headcountArea!: AreaChartOptions;        // Effectif global (tendance)
  hiresDeparturesBar!: BarChartOptions;    // Entrées vs Sorties (mois)
  absenceRadial!: RadialChartOptions;      // Taux d’absence
  departmentsDonut!: DonutChartOptions;    // Répartition par service

  constructor() {}

  ngOnInit(): void {
    // initialise des graphes pour éviter toute erreur d'inputs non définis
    this.initChartsWithDefaults();

    // charge stats (ici mock; remplacer par appel API ensuite)
    this.loadStats();
  }

  /** =========================
   *  1) INIT CHARTS (défauts)
   *  ========================= */
  private initChartsWithDefaults(): void {
    // ---- EFFECTIF (area) : tendance sur 6 mois ----
    this.headcountArea = {
      series: [
        { name: 'Effectif', data: [120, 125, 128, 132, 136, 140] }
      ],
      chart: { type: 'area', height: 320, toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient', gradient: { opacityFrom: 0.45, opacityTo: 0.15 } },
      xaxis: { categories: ['Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept'] },
      grid: { strokeDashArray: 4 },
      tooltip: { theme: 'light' },
      legend: { position: 'top' }
    };

    // ---- ENTREE vs SORTIE (bar) ----
    this.hiresDeparturesBar = {
      series: [
        { name: 'Entrées', data: [4, 6, 5, 7, 8, 6] },
        { name: 'Sorties', data: [2, 3, 4, 2, 5, 3] }
      ],
      chart: { type: 'bar', height: 320, stacked: false, toolbar: { show: false } },
      plotOptions: { bar: { columnWidth: '45%', borderRadius: 6 } },
      dataLabels: { enabled: false },
      xaxis: { categories: ['Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept'] },
      yaxis: { labels: { show: true } },
      grid: { strokeDashArray: 4 },
      tooltip: { theme: 'light' },
      legend: { position: 'top' }
    };

    // ---- ABSENCE (radial) ----
    this.absenceRadial = {
      series: [12], // %
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

    // ---- RÉPARTITION PAR SERVICE (donut) ----
    this.departmentsDonut = {
      series: [40, 25, 20, 15], // RH, Finance, IT, Opérations (exemple)
      chart: { type: 'donut', height: 320 },
      labels: ['RH', 'Finance', 'IT', 'Opérations'],
      legend: { position: 'bottom' },
      responsive: [
        { breakpoint: 992, options: { legend: { position: 'bottom' } } }
      ],
      tooltip: { y: { formatter: (val: number) => `${val}` } }
    };
  }

  /** =========================
   *  2) CHARGER LES STATS
   *  =========================
   *  👉 Remplace ce mock par ton appel HttpClient vers l’API RH
   */
  private loadStats(): void {
    // ---- MOCK: simule des valeurs venues du backend ----
    const backend = {
      totalPersonnel: 142,
      postesOuverts: 7,
      enAbsence: 9,
      tauxTurnover: 6.3, // %
      // séries mensuelles pour 6 derniers mois (même catégories que plus haut)
      headcountSeries: [120, 125, 128, 132, 138, 142],
      hires: [5, 7, 4, 9, 11, 8],
      departures: [3, 2, 4, 3, 5, 2],
      absenceRate: 11.5,
      departments: {
        labels: ['RH', 'Finance', 'IT', 'Opérations', 'Commercial'],
        values: [38, 28, 32, 22, 22] // somme arbitraire; c'est juste une répartition
      }
    };

    // ---- Alimente KPI ----
    this.kpi = {
      totalPersonnel: backend.totalPersonnel ?? 0,
      postesOuverts: backend.postesOuverts ?? 0,
      enAbsence: backend.enAbsence ?? 0,
      tauxTurnover: Math.round((backend.tauxTurnover ?? 0) * 10) / 10
    };

    // ---- Mettre à jour graphiques avec ces données ----

    // Area: Effectif
    this.headcountArea = {
      ...this.headcountArea,
      series: [{ name: 'Effectif', data: backend.headcountSeries ?? [] }]
    };

    // Bar: Entrées / Sorties
    this.hiresDeparturesBar = {
      ...this.hiresDeparturesBar,
      series: [
        { name: 'Entrées', data: backend.hires ?? [] },
        { name: 'Sorties', data: backend.departures ?? [] }
      ]
    };

    // Radial: Absence
    this.absenceRadial = {
      ...this.absenceRadial,
      series: [Math.round((backend.absenceRate ?? 0) * 10) / 10]
    };

    // Donut: Départements
    this.departmentsDonut = {
      ...this.departmentsDonut,
      labels: backend.departments?.labels ?? ['RH', 'Finance', 'IT', 'Opérations'],
      series: backend.departments?.values ?? [40, 25, 20, 15],
      responsive: this.departmentsDonut.responsive ?? []
    };
  }
}

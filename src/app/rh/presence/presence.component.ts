// src/app/rh/presence/presence.component.ts
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of, Observable } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

import { PresenceService } from '../services/presence.service';
import { PersonnelService } from '../services/personnel.service';
import { Presence } from '../models/presence';
import { Personnel } from '../models/personnel';
import { Service } from '../models/service';
import { DataStateEnum, ModelDataState } from '../../state/state';

@Component({
  selector: 'app-presence',
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.scss']
})
export class PresenceComponent implements OnInit {
  items: any[] = [];
  dataStateEnum = DataStateEnum;

  // listing
  presences$?: Observable<ModelDataState<Presence[]>>;
  listePage: Presence[] = [];
  total = 0;
  currentPage = 0;
  pageSize = 10;

  // ✅ tri SAFE par défaut (évite 500 liés au champ inexistant)
  sortField = 'id';
  sortDir: 'asc' | 'desc' = 'desc';

  pages: number[] = [];
  totalPages = 0;

  // filtres
  moisCtrl = new FormControl<number | null>(null);
  anneeCtrl = new FormControl<number | null>(null);
  serviceIdCtrl = new FormControl<number | null>(null);
  csrhValideSeulement = new FormControl<boolean>(false);

  // dropdowns
  listePersonnel: Personnel[] = [];
  listeServices: Service[] = [];

  // formulaire modal (création / validation)
  form = new FormGroup({
    id: new FormControl<number | null>(null),
    personnelId: new FormControl<number | null>(null, [Validators.required]),
    mois: new FormControl<number | null>(null, [Validators.required]),
    nbreJourAbsent: new FormControl<number | null>(0, [Validators.min(0)])
  });

  // sélection de masse
  selectedIds = new Set<number>();

  constructor(
    private presenceService: PresenceService,
    private personnelService: PersonnelService,
    private modal: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'Ressources Humaines' },
      { label: 'Présences', active: true }
    ];

    this.chargerPersonnels();
    this.chargerServices();
    this.chargerPage(); // première charge
  }

  // --- dropdown data ---
  chargerPersonnels(): void {
    this.personnelService.listerPersonnelPage(0, 1000, 'asc')
      .subscribe((resp: any) => this.listePersonnel = resp.body?.content ?? []);
  }

  chargerServices(): void {
    try {
      // @ts-ignore (si tu as un ServiceService séparé)
      import('../services/service.service').then(m => {
        const svc = new m.ServiceService(this.personnelService['httpClient']); // réutilise HttpClient
        svc.listerServicePage(0, 1000, 'asc').subscribe((resp: any) => {
          this.listeServices = resp.body?.content ?? [];
        });
      }).catch(() => {});
    } catch {}
  }

  // --- listing ---
  chargerPage(): void {
    const mois = this.moisCtrl.value ?? undefined;
    const annee = this.anneeCtrl.value ?? undefined;
    const serviceId = this.serviceIdCtrl.value ?? undefined;

    const obs = this.csrhValideSeulement.value
      ? this.presenceService.listerPresenceMarqueALLPage(
          this.currentPage, this.pageSize, this.sortField, this.sortDir, mois, annee, serviceId
        )
      : this.presenceService.listerPresenceALLPage(
          this.currentPage, this.pageSize, this.sortField, this.sortDir, mois, annee, serviceId
        );

    this.presences$ = obs.pipe(
      map((resp: any) => {
        this.listePage = resp.body?.content ?? [];
        this.total = resp.body?.totalElements ?? 0;
        this.totalPages = resp.body?.totalPages ?? 0;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
        this.selectedIds.clear();
        return { dataState: this.dataStateEnum.CHARGE, data: this.listePage };
      }),
      startWith({ dataState: this.dataStateEnum.CHARGEMENT }),
      catchError((e) => {
        this.toastr.error(e?.error?.message ?? 'Erreur lors du chargement des présences', 'Erreur');
        return of({ dataState: this.dataStateEnum.ERREUR, data: [] });
      })
    );
  }

  // --- modal ---
  openModal(modalRef: any, presence?: Presence): void {
    if (presence) {
      this.form.patchValue({
        id: presence.id ?? null,
        personnelId: presence.personnel?.id ?? null,
        mois: presence.mois ?? null,
        nbreJourAbsent: presence.nbreJourAbsent ?? 0
      });
    } else {
      this.form.reset({
        id: null,
        personnelId: null,
        mois: null,
        nbreJourAbsent: 0
      });
    }
    this.modal.open(modalRef, { size: 'lg', backdrop: 'static', keyboard: false });
  }

  // création ou validation unitaire
  async submit(): Promise<void> {
    if (this.form.invalid) return;

    const v = this.form.value;

    // mois futur → block UI
    if (!v.id && typeof v.mois === 'number') {
      const moisActuel = new Date().getMonth() + 1;
      if (v.mois > moisActuel) {
        this.toastr.error('Le mois choisi est dans le futur.', 'Erreur');
        return;
      }
    }

    const personnelId = Number(v.personnelId);
    const mois = Number(v.mois);
    const nbre = Number(v.nbreJourAbsent ?? 0);

    try {
      const existId = await this.presenceService.getPresenceIdIfExists(personnelId, mois);

      if (existId !== null && !Number.isNaN(Number(existId))) {
        // PATCH
        this.presenceService.modifierPresence(Number(existId), nbre).subscribe({
          next: () => { this.toastr.info('Présence existante mise à jour'); this.modal.dismissAll(); this.chargerPage(); },
          error: (e) => this.toastr.error(e?.error?.message ?? 'Erreur serveur', 'Erreur')
        });
      } else {
        // POST
        this.presenceService.creerPresence(personnelId, nbre, mois).subscribe({
          next: () => { this.toastr.success('Présence créée'); this.modal.dismissAll(); this.chargerPage(); },
          error: (err) => this.toastr.error(err?.error?.message ?? 'Erreur serveur', 'Erreur')
        });
      }
    } catch (e: any) {
      this.toastr.error(e?.message ?? 'Erreur interne', 'Erreur');
    }
  }

  // --- actions unitaires ---
  valider(p: Presence): void {
    if (!p || p.id == null || Number.isNaN(Number(p.id))) {
      this.toastr.error('Identifiant de présence invalide.', 'Erreur');
      return;
    }
    this.presenceService.modifierPresence(Number(p.id), p.nbreJourAbsent ?? 0).subscribe({
      next: () => { this.toastr.success('Présence validée'); this.chargerPage(); },
      error: (e) => this.toastr.error(e?.error?.message ?? 'Erreur serveur', 'Erreur')
    });
  }

  invalider(p: Presence): void {
    if (!p || p.id == null) return;
    this.presenceService.annulerValidationPresence(p.id, '').subscribe({
      next: () => { this.toastr.info('Présence invalidée'); this.chargerPage(); },
      error: (e) => this.toastr.error(e?.error?.message ?? 'Erreur serveur', 'Erreur')
    });
  }

  // --- sélection / bulk ---
  toggleSelect(p: Presence, e: any): void {
    if (e?.target?.checked) this.selectedIds.add(p.id);
    else this.selectedIds.delete(p.id);
  }

  toutCocher(e: any): void {
    if (e?.target?.checked) this.listePage.forEach(p => this.selectedIds.add(p.id));
    else this.selectedIds.clear();
  }

  validerSelection(): void {
    if (!this.selectedIds.size) return;
    const ids = Array.from(this.selectedIds);
    this.presenceService.validerALLPresence(ids as any, '').subscribe({
      next: () => { this.toastr.success('Présences validées'); this.chargerPage(); },
      error: (e) => this.toastr.error(e?.error?.message ?? 'Erreur serveur', 'Erreur')
    });
  }

  invaliderSelection(): void {
    if (!this.selectedIds.size) return;
    const ids = Array.from(this.selectedIds);
    this.presenceService.annulervalidationALLPresence(ids as any, '').subscribe({
      next: () => { this.toastr.info('Présences invalidées'); this.chargerPage(); },
      error: (e) => this.toastr.error(e?.error?.message ?? 'Erreur serveur', 'Erreur')
    });
  }

  // --- util ---
  // --- util ---
afficherNomPersonnel(row: any): string {
  if (!row) return '';
  // priorité aux champs du DTO (plats)
  const prenom =
    row?.personnelPrenom ??
    row?.personnel?.etatCivil?.prenom ??
    row?.personnel?.prenom ??
    '';
  const nom =
    row?.personnelNom ??
    row?.personnel?.etatCivil?.nom ??
    row?.personnel?.nom ??
    '';
  return `${prenom} ${nom}`.trim();
}


  onChangerFiltres(): void {
    this.currentPage = 0;
    this.chargerPage();
  }
}

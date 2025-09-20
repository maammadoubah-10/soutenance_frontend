import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, startWith, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { AffectationService } from '../services/affectation.service';
import { PersonnelService } from '../services/personnel.service';
import { PosteService } from '../services/poste.service';
import { Poste } from '../models/poste';
import { Personnel } from '../models/personnel';
import Swal from 'sweetalert2';
import { DataStateEnum, ModelDataState } from '../../state/state';
import { AffectationDto } from '../models/affectation-dto';
import { Affectation } from '../models/affectation';

@Component({
  selector: 'app-affectation',
  templateUrl: './affectation.component.html',
  styleUrls: ['./affectation.component.scss']
})
export class AffectationComponent implements OnInit {
  items: any[] = [];
  dataStateEnum = DataStateEnum;

  affectations$?: Observable<ModelDataState<Affectation[]>>;
  listePage: Affectation[] = [];

  listePersonnel: Personnel[] = [];
  listePostes: Poste[] = [];

  total = 0;
  currentPage = 0;
  pageSize = 10;
  sort = 'desc';
  pages: number[] = [];
  totalPages = 0;

  form = new FormGroup({
    id: new FormControl<number | null>(null),
    personnel: new FormControl<number | null>(null, [Validators.required]),
    poste: new FormControl<number | null>(null, [Validators.required]),
    dateDebut: new FormControl<string | null>(null, [Validators.required])
  });

  constructor(
    private affectationService: AffectationService,
    private personnelService: PersonnelService,
    private posteService: PosteService,
    private toastr: ToastrService,
    private modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'Ressources Humaines' },
      { label: 'Affectations', active: true }
    ];
    this.chargerPage();
    this.chargerPersonnels();
    this.chargerPostes();
  }

  private formatDateForInput(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    const y = d.getFullYear();
    const m = ('0' + (d.getMonth() + 1)).slice(-2);
    const dd = ('0' + d.getDate()).slice(-2);
    return `${y}-${m}-${dd}`;
  }

  chargerPage(): void {
    this.affectations$ = this.affectationService
      .lister(this.currentPage, this.pageSize, this.sort)
      .pipe(
        map((resp: any) => {
          this.listePage = resp.body?.content ?? [];
          this.total = resp.body?.totalElements ?? 0;
          this.totalPages = resp.body?.totalPages ?? 0;
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
          return { dataState: this.dataStateEnum.CHARGE, data: this.listePage };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT }),
        catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] }))
      );
  }

  chargerPersonnels(): void {
    this.personnelService.listerPersonnelPage(0, 1000, 'asc')
      .subscribe((resp: any) => this.listePersonnel = resp.body?.content ?? []);
  }

  chargerPostes(): void {
    this.posteService.listerPostePage(0, 1000, 'asc')
      .subscribe((resp: any) => this.listePostes = resp.body?.content ?? []);
  }

  openModal(modalRef: any, affectation?: Affectation) {
    if (affectation) {
      this.form.patchValue({
        id: affectation.id ?? null,
        personnel: affectation.personnel?.id ?? null,
        poste: affectation.poste?.id ?? null,
        dateDebut: this.formatDateForInput(affectation.dateDebut)
      });
    } else {
      this.form.reset();
    }
    this.modal.open(modalRef, { size: 'lg', backdrop: 'static', keyboard: false });
  }

  submit() {
    if (this.form.invalid) return;

    const v = this.form.value;
    const dto: AffectationDto = {
      personnel: Number(v.personnel),
      poste: Number(v.poste),
      dateDebut: String(v.dateDebut) // "yyyy-MM-dd"
    };

    if (v.id) {
      this.affectationService.modifier(Number(v.id), dto).subscribe({
        next: () => {
          this.toastr.success('Affectation modifiée');
          this.modal.dismissAll();
          this.chargerPage();
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.affectationService.creer(dto).subscribe({
        next: () => {
          this.toastr.success('Affectation créée');
          this.modal.dismissAll();
          this.chargerPage();
        },
        error: (err) => this.handleError(err)
      });
      // ⤷ si ton backend préfère la route alternative, remplace par:
      // this.affectationService.affecter(dto.personnel, dto.poste, dto.dateDebut)...
    }
  }

  supprimer(id?: number) {
    if (!id) return;
    Swal.fire({
      title: 'Supprimer ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.affectationService.supprimer(id).subscribe({
          next: () => {
            this.toastr.success('Affectation supprimée');
            this.chargerPage();
          },
          error: (err) => this.handleError(err)
        });
      }
    });
  }

  private handleError(error: any) {
    console.error('Affectation error raw =>', error);
    if (error?.error?.errors?.length) {
      for (const e of error.error.errors) {
        this.toastr.error(`${e.champs} : ${e.message}`, 'Erreur');
      }
    } else if (error?.error?.message) {
      this.toastr.error(error.error.message, 'Erreur');
    } else {
      this.toastr.error('Erreur serveur', 'Erreur');
    }
  }
}

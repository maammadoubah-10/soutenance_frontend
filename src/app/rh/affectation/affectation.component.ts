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
  public sort: 'asc' | 'desc' = 'desc';

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
  if (this.form.invalid) {
    this.toastr.error('Veuillez remplir les champs obligatoires', 'Erreur');
    return;
  }

  const v = this.form.value;
  const dto: AffectationDto = {
    personnel: Number(v.personnel),
    poste: Number(v.poste),
    dateDebut: String(v.dateDebut) // "yyyy-MM-dd"
  };

  if (v.id) {
    // 🔁 MODIFICATION
    this.affectationService.modifier(Number(v.id), dto).subscribe({
      next: () => {
        this.toastr.success('Affectation modifiée', 'Succès');
        this.modal.dismissAll();
        this.chargerPage();
      },
      error: (error) => {
        console.error('Erreur MODIF affectation =>', error);
        const res = error.error || error;

        // 🔴 Conflit 409 → doublon
        if (error.status === 409) {
          Swal.fire(
            'Affectation impossible',
            'Ce personnel est déjà affecté à ce poste.',
            'error'
          );
          // (tu peux garder aussi un toast si tu veux)
          // this.toastr.error('Ce personnel est déjà affecté à ce poste.', 'Affectation impossible');
          return;
        }

        // Autres erreurs avec tableau errors
        if (res?.errors) {
          for (let er of res.errors) {
            this.toastr.error(`${er.champs} : ${er.message}`, 'Erreur');
          }
        } else {
          this.toastr.error(res?.message || 'Erreur lors de la modification', 'Erreur');
        }
      }
    });
  } else {
    // 🆕 CREATION
    this.affectationService.creer(dto).subscribe({
      next: () => {
        this.toastr.success('Affectation créée', 'Succès');
        this.modal.dismissAll();
        this.chargerPage();
      },
      error: (error) => {
        console.error('Erreur CREATION affectation =>', error);
        const res = error.error || error;

        // 🔴 Conflit 409 → doublon
        if (error.status === 409) {
          Swal.fire(
            'Affectation impossible',
            'Ce personnel est déjà affecté à ce poste.',
            'error'
          );
          // Optionnel : toast en plus
          // this.toastr.error('Ce personnel est déjà affecté à ce poste.', 'Affectation impossible');
          return;
        }

        // Autres erreurs avec tableau errors
        if (res?.errors) {
          for (let er of res.errors) {
            this.toastr.error(`${er.champs} : ${er.message}`, 'Erreur');
          }
        } else {
          this.toastr.error(res?.message || 'Erreur lors de la création', 'Erreur');
        }
      }
    });
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
          //error: (err) => this.handleError(err)
        });
      }
    });
  }



}

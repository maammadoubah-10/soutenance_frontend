import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { Unite } from '../models/unite';
import { UniteService } from '../services/unite.service';

// ⬇️ le titre de page est un composant standalone exporté par CommunModule
import { TitredepageComponent } from '../../commun/titredepage/titredepage.component';

@Component({
  standalone: true,
  selector: 'app-unite',
  templateUrl: './unite.component.html',
  styleUrls: ['./unite.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgxPaginationModule,
    TitredepageComponent
  ]
})
export class UniteComponent implements OnInit {
  // Données et état
  public modesPaiement: Unite[] = [];
  public loading = false;
  public submitting = false;
  public selectedModePaiement: Unite | null = null;
  public action: 'create' | 'edit' | 'delete' = 'create';

  // Pagination
  public perPage = 10;
  public currentPage = 1;
  public totalItems = 0;

  // Formulaire
  public modePaiementForm!: FormGroup;

  // Breadcrumb
  public items = [
    { label: 'Paiement' },
    { label: 'Unites', active: true }
  ];

  constructor(
    private modePaiementService: UniteService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadModesPaiement();
  }

  /** Nombre total de pages (affichage) */
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.perPage));
  }

  /** Initialise le formulaire réactif */
  private initializeForm(): void {
    this.modePaiementForm = this.fb.group({
      designation: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  /** Charge la liste paginée */
  public loadModesPaiement(): void {
    this.loading = true;
    this.modePaiementService
      .listerUnitePage(this.currentPage - 1, this.perPage)
      .subscribe({
        next: (response) => {
          this.modesPaiement = response.content ?? [];
          this.totalItems = response.totalElements ?? this.modesPaiement.length;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement:', error);
          this.loading = false;
        }
      });
  }

  /** Handler pagination ngx-pagination (renvoie bien un number) */
  public onPageChange(page: number): void {
    this.currentPage = page;
    this.loadModesPaiement();
  }

  /** Ouvre le modal avec l’action spécifiée */
  public initAction(modePaiement: Unite | null, action: 'create' | 'edit' | 'delete', modal: TemplateRef<any>): void {
    this.selectedModePaiement = modePaiement;
    this.action = action;

    if (action === 'edit' && modePaiement) {
      this.modePaiementForm.patchValue({ designation: modePaiement.designation });
    } else if (action === 'create') {
      this.modePaiementForm.reset();
    }

    this.modalService.open(modal, { centered: true, backdrop: 'static', keyboard: false });
  }

  /** Création */
  public creerModePaiement(): void {
    if (this.modePaiementForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    this.submitting = true;
    this.modePaiementService.creerUnite(this.modePaiementForm.value).subscribe({
      next: () => {
        this.modalService.dismissAll();
        this.loadModesPaiement();
        this.submitting = false;
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        this.submitting = false;
      }
    });
  }

  /** Modification */
  public modifierModePaiement(): void {
    if (this.modePaiementForm.invalid || !this.selectedModePaiement) {
      this.markFormGroupTouched();
      return;
    }
    this.submitting = true;
    this.modePaiementService
      .modifierUnite(this.selectedModePaiement.id, this.modePaiementForm.value)
      .subscribe({
        next: () => {
          this.modalService.dismissAll();
          this.loadModesPaiement();
          this.submitting = false;
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.submitting = false;
        }
      });
  }

  /** Suppression */
  public supprimerModePaiement(): void {
    if (!this.selectedModePaiement) return;
    this.submitting = true;
    this.modePaiementService.supprimerUnite(this.selectedModePaiement.id).subscribe({
      next: () => {
        this.modalService.dismissAll();
        this.loadModesPaiement();
        this.submitting = false;
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.submitting = false;
      }
    });
  }

  /** Marque les champs touchés pour afficher les erreurs */
  private markFormGroupTouched(): void {
    Object.keys(this.modePaiementForm.controls).forEach(key => {
      this.modePaiementForm.get(key)?.markAsTouched();
    });
  }

  /** Reset */
  public clear(): void {
    this.modePaiementForm.reset();
  }

  // Getter pratique
  get designation() { return this.modePaiementForm.get('designation'); }
}

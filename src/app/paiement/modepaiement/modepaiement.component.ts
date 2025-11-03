import { Component, OnInit, TemplateRef } from '@angular/core';
import { ModeDePaiement } from '../../rh/models/mode-de-paiement';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModeDePaiementService } from '../../rh/services/mode-de-paiement.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modepaiement',
  templateUrl: './modepaiement.component.html',
  styleUrl: './modepaiement.component.scss'
})
export class ModepaiementComponent implements OnInit {
   // Données et état
  public modesPaiement: ModeDePaiement[] = [];
  public loading = false;
  public submitting = false;
  public selectedModePaiement: ModeDePaiement | null = null;
  public action: 'create' | 'edit' | 'delete' = 'create';

  // Pagination
  public perPage = 10;
  public currentPage = 1;
  public totalItems = 0;

  // Formulaire
  public modePaiementForm!: FormGroup;

  // Breadcrumb
  public items = [
    { label: 'Paramètres' },
    { label: 'Modes de Paiement', active: true }
  ];

  constructor(
    private modePaiementService: ModeDePaiementService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadModesPaiement();
  }

  /**
   * Initialise le formulaire réactif
   */
  private initializeForm(): void {
    this.modePaiementForm = this.fb.group({
      designation: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  /**
   * Charge la liste des modes de paiement
   */
  public loadModesPaiement(): void {
    this.loading = true;
    this.modePaiementService.listerModeDePaiementPage(this.currentPage - 1, this.perPage)
      .subscribe({
        next: (response) => {
          this.modesPaiement = response.content;
          this.totalItems = response.totalElements;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement:', error);
          this.loading = false;
        }
      });
  }

  /**
   * Ouvre le modal avec l'action spécifiée
   */
  public initAction(modePaiement: ModeDePaiement | null, action: 'create' | 'edit' | 'delete', modal: TemplateRef<any>): void {
    this.selectedModePaiement = modePaiement;
    this.action = action;

    if (action === 'edit' && modePaiement) {
      this.modePaiementForm.patchValue({
        designation: modePaiement.designation
      });
    } else if (action === 'create') {
      this.modePaiementForm.reset();
    }

    this.modalService.open(modal, { 
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }

  /**
   * Crée un nouveau mode de paiement
   */
  public creerModePaiement(): void {
    if (this.modePaiementForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    this.modePaiementService.creerModeDePaiement(this.modePaiementForm.value)
      .subscribe({
        next: (response) => {
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

  /**
   * Modifie un mode de paiement existant
   */
  public modifierModePaiement(): void {
    if (this.modePaiementForm.invalid || !this.selectedModePaiement) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    this.modePaiementService.modifierModeDePaiement(
      this.selectedModePaiement.id, 
      this.modePaiementForm.value
    ).subscribe({
      next: (response) => {
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

  /**
   * Supprime un mode de paiement
   */
  public supprimerModePaiement(): void {
    if (!this.selectedModePaiement) return;

    this.submitting = true;
    this.modePaiementService.supprimerModeDePaiement(this.selectedModePaiement.id)
      .subscribe({
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

  /**
   * Marque tous les champs du formulaire comme touchés pour afficher les erreurs
   */
  private markFormGroupTouched(): void {
    Object.keys(this.modePaiementForm.controls).forEach(key => {
      this.modePaiementForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Réinitialise le formulaire
   */
  public clear(): void {
    this.modePaiementForm.reset();
  }

  // Getters pour accéder facilement aux contrôles du formulaire
  get designation() { return this.modePaiementForm.get('designation'); }

}

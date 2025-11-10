import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ImpactSalarial } from '../models/impact-salarial';
import { TypeImpactSalarial } from '../models/type-impact-salarial';
import { Poste } from '../models/poste';
import { Category } from '../models/category';
import { ImpactSalarialService } from '../services/impact-salarial.service';
import functionsService from '../services/functions.service';
import { PosteService } from '../services/poste.service';
import { CategorieService } from '../services/categorie.service';
import { TypeImpactSalarialService } from '../services/type-impact-salarial.service';

@Component({
  selector: 'app-impact-salarial',
  templateUrl: './impact-salarial.component.html',
  styleUrls: ['./impact-salarial.component.scss']
})
export class ImpactSalarialComponent implements OnInit {

  public impactSalarials: ImpactSalarial[] = []
  public typeImpactSalarials: TypeImpactSalarial[] = []
  public posteListe: Poste[] = []
  public postesDetails: Poste[] = []
  public categorieListe: Category[] = []
  public categorieDetails: Category[] = []
  public impactSalarialForm!: FormGroup;
  public perPage: number = 10;
  public p: number = 1;
  public loading: boolean = false;
  public id: number = 0;
  items: any[] = [];

  constructor(private router: Router, private _impactSalarialService: ImpactSalarialService, private _typeImpactSalarialService: TypeImpactSalarialService, private modalService: NgbModal, private _posteService: PosteService, private _categorieService: CategorieService) {

  }

  ngOnInit(): void {
    this.impactSalarialForm = this.initForm()

    this.getImpactSalarials()

    this._typeImpactSalarialService.getToutTypeImpactSalarial().subscribe(
      (data: any) => {
        console.log(data);
        this.typeImpactSalarials = data;
        
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log('Terminé');
        console.log(this.typeImpactSalarials);
      }
    )

    this.items = [
      { label: 'Paiement' },
      { label: 'Impacts Salarial', active: true },
    ];

    this._posteService.getToutPostes().subscribe(
      (data: any) => {
        this.posteListe = data
        console.log(this.posteListe)
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log('Terminé');
      }
    )

    this._categorieService.getCategories().subscribe(
      (data: any) => {
        this.categorieListe = data.content
        this.categorieListe = data.content || [];
        console.log(this.categorieListe)
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log('Terminé');
      }
    )
  }

  getImpactSalarials() {
    this._impactSalarialService.getimpactSalarial(0, this.perPage).subscribe(
      (data: any) => {
        this.impactSalarials = data.content
        this.impactSalarials = data.content || [];
        console.log(data);
        console.log(data.totalPages);
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log('Terminé');
      }
    )
  }

  onPageChange(event: any): void {
    this.p = event
    this.getImpactSalarials();
  }

  initForm(impactSalarial?: ImpactSalarial): FormGroup {
    return new FormGroup({
      id: new FormControl(impactSalarial != null ? impactSalarial.id : null),
      typeImpactSalarial: new FormControl(impactSalarial != null ? impactSalarial.typeImpactSalarial.id : this.typeImpactSalarials[0]?.id, Validators.compose([Validators.required])),
      postes: new FormControl([]),
      categories: new FormControl([]),
      montant: new FormControl(impactSalarial != null ? impactSalarial.montant : ""),
      taux: new FormControl(impactSalarial != null ? impactSalarial.taux : ""),
    })
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.modalService.open(content);
  }

  openModalDetails(content: any, postes?: Poste[] | null, categories?: Category[]) {
    this.modalService.open(content);
    this.postesDetails = []
    this.categorieDetails = []
    if (postes) {
      this.postesDetails = postes
    }
    if (categories) {
      this.categorieDetails = categories
    }
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  successmsg(title = 'Type d\'impact salarial ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau Type d\'impact salarial !') {
    Swal.fire(title, message, 'success');
  }

  clear() {
    this.impactSalarialForm = this.initForm()
  }

  traiteFormImpactSalarial() {
    if (this.impactSalarialForm?.get('id')?.value == null) {
      this.createimpactSalarialervice()
    } else {
      this.updateimpactSalarialervice()
    }
  }

  createimpactSalarialervice() {
    let _data = {
      "montant": this.montant?.value,
      "taux": this.taux?.value,
      "typeImpactSalarial": this.typeImpactSalarial?.value,
      "categories": this.categories?.value,
      "postes": this.postes?.value,
    }
    this.loading = true
    this._impactSalarialService.createimpactSalarialervice(_data).subscribe(
      data => {
        this.impactSalarialForm = this.initForm()
        this.closeModal()
        this.successmsg()
        this.impactSalarials.unshift(data)
        this.loading = false
      },
      error => {
        this.loading = false
        console.log(error);
        this.impactSalarialForm.get("montant")?.setErrors({ 'unique': functionsService.getHisError(error.error.errors, "montant") })
        this.impactSalarialForm.get("taux")?.setErrors({ 'unique': functionsService.getHisError(error.error.errors, "taux") })
        this.impactSalarialForm.get("type")?.setErrors({ 'unique': functionsService.getHisError(error.error.errors, "type") })
        this.impactSalarialForm.get("categories")?.setErrors({ 'unique': functionsService.getHisError(error.error.errors, "categories") })
        this.impactSalarialForm.get("postes")?.setErrors({ 'unique': functionsService.getHisError(error.error.errors, "postes") })
      }
    )
  }

  initAction(impactSalarial: ImpactSalarial | null, action: string = "delete", content: any) {
    this.openModal(content)
    let idsCategorie = []
    let idsPoste = []
    this.impactSalarialForm = this.initForm(impactSalarial!)
    if (impactSalarial != null) {
      this.id = impactSalarial.id
      for (let categorie of impactSalarial.categories) {
        idsCategorie.push(categorie.id)
        console.log(idsCategorie);
      }
      this.categories?.patchValue(idsCategorie);
      for (let poste of impactSalarial.postes) {
        idsPoste.push(poste.id)
        console.log(idsPoste);
      }
      this.postes?.patchValue(idsPoste);

    }
  }

  deleteImpactSalarial() {
    this.loading = true
    this._impactSalarialService.deleteimpactSalarial(this.id).subscribe(
      data => {
        this.impactSalarialForm = this.initForm()
        this.closeModal()
        this.successmsg("Type d'impact salarial supprimer", "Le Type d'impact salarial a été bien supprimé avec succès")
        this.loading = false
        this.impactSalarials = this.impactSalarials.filter(i => i.id !== this.id)
      },
      error => {
        this.loading = false
        this.impactSalarialForm = this.initForm()
        this.closeModal()
        Swal.fire('Suppression', error.error.message, 'error');
      }
    )
  }

  updateimpactSalarialervice() {
    let _data = {
      "montant": this.montant?.value,
      "taux": this.taux?.value,
      "typeImpactSalarial": this.typeImpactSalarial?.value,
      "categories": this.categories?.value,
      "postes": this.postes?.value,
    }
    this.loading = true
    this._impactSalarialService.updateimpactSalarial(this.id, _data).subscribe(
      data => {
        this.impactSalarialForm = this.initForm()
        this.closeModal()
        this.successmsg("Type d'impact salarial modifier", "Vous venez modifier le Type d'impact salarial ")
        this.impactSalarials = this.impactSalarials.map(i => i.id !== this.id ? i : data)
        this.loading = false
      },
      error => {
        this.loading = false
        this.impactSalarialForm.get("montant")?.setErrors({ 'unique': functionsService.getHisError(error.error.errors, "montant") })
        this.impactSalarialForm.get("taux")?.setErrors({ 'unique': functionsService.getHisError(error.error.errors, "taux") })
        this.impactSalarialForm.get("typeImpactSalarial")?.setErrors({ 'unique': functionsService.getHisError(error.error.errors, "typeImpactSalarial") })
        this.impactSalarialForm.get("categories")?.setErrors({ 'unique': functionsService.getHisError(error.error.errors, "categories") })
        this.impactSalarialForm.get("postes")?.setErrors({ 'unique': functionsService.getHisError(error.error.errors, "postes") })
      }
    )
  }

  get montant() {
    return this.impactSalarialForm.get('montant')
  }
  get taux() {
    return this.impactSalarialForm.get('taux')
  }
  get typeImpactSalarial() {
    return this.impactSalarialForm.get('typeImpactSalarial')
  }
  get categories() {
    return this.impactSalarialForm.get('categories')
  }
  get postes() {
    return this.impactSalarialForm.get('postes')
  }

  show(impactSalarial: ImpactSalarial) {
    this.router.navigate(['/paie/type/retenu/' + impactSalarial.id])
  }

}

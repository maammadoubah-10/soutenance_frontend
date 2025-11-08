import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../models/category';
import { CategorieService } from '../services/categorie.service';
import { UniteService } from '../services/unite.service';
import { Unite } from '../models/unite';
import functionsService from '../services/functions.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  items: any[] = [];
  public categories: Category[] = [];
  public unite: Unite[] = [];
  public categoryForm!: FormGroup;
  public perPage: number = 10;
  public p: number = 1;
  public loading: boolean = false;
  public id: number = 0;

  constructor(private router: Router, private _categorieService: CategorieService, private modalService: NgbModal, private uniteService: UniteService) {

  }

  ngOnInit(): void {
    this.categoryForm = this.initForm()
    // this._categorieService.getCategories().subscribe((data:any) =>{
    //   this.categories = data['content']
    //   },(error)=>{
    //     console.log(error);
    //   }, ()=>{
    //     console.log("Terminer");
    //   }
    // )

    this.loadcategories();

    this.uniteService.listerUnitePage().subscribe((response: any) => {
      this.unite = response.content; // Extraire le tableau des banques
    }, (error) => {
      console.log(error);
    }, () => {
      console.log("Terminé");
    }
    )

    this.items = [
      { label: 'Paiement' },
      { label: 'Categories', active: true },
    ];
  }

  loadcategories() {
    this._categorieService.getCategories().subscribe({
      next: (data: any) => {
        console.log('Données complètes:', data);
        console.log('Content:', data.content);

        // Vérifier la structure d'un élément
        if (data.content && data.content.length > 0) {
          console.log('Premier élément:', data.content[0]);
          console.log('Propriétés disponibles:', Object.keys(data.content[0]));
        }

        this.categories = data.content || [];
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.categories = [];
      }
    });
  }

  initForm(category?: Category): FormGroup {
    return new FormGroup({
      id: new FormControl(category != null ? category.id : null),
      //categorie: new FormControl(category != null ? category.categorie : "", Validators.compose([Validators.required])),

      designation: new FormControl(category != null ? category.designation : "", Validators.compose([Validators.required])),
      unite: new FormControl(category != null && category.unite ? category.unite.id : "", Validators.compose([Validators.required])),
    })
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.modalService.open(content);
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  successmsg(title = 'categorie ajouter !', message = 'Vous venez d\'ajoutez avec succès une nouvelleeeeee categorie !') {
    Swal.fire(title, message, 'success');
  }

  clear() {
    this.categoryForm?.reset()
  }

  traiteformCategory() {
    if (this.categoryForm?.get('id')?.value == null) {
      this.createCategory()
    } else {
      this.updateCategory()
    }
  }

  get unitee() {
    return this.categoryForm?.get('unite')
  }

  get designation() {
    return this.categoryForm?.get('designation')
  }

  createCategory() {
    let _data = {
      "designation": this.designation?.value,
      "unite": this.unitee?.value,
    }
    this.loading = true
    this._categorieService.createCategory(_data).subscribe(
      data => {
        this.clear()
        this.closeModal()
        this.successmsg()
        this.categories.unshift(data)
        this.loading = false
      },
      error => {
        this.loading = false
        console.log(error);
        this.categoryForm?.get("designation")?.setErrors({ 'unique': functionsService.getHisError(error.error.errors, "designation") })
      }
    )
  }

  initAction(category: Category | null, action: string = "delete", content: any) {
    this.openModal(content)
    if (category != null) {
      this.id = category.id
    }
    this.categoryForm = this.initForm(category!)
  }

  deleteCategory() {
    this.loading = true
    this._categorieService.deleteCategory(this.id).subscribe(
      data => {
        this.categoryForm = this.initForm()
        this.closeModal()
        this.successmsg("Categorie supprimer", "La Categorie a été bien supprimé avec succès")
        this.loading = false
        this.categories = this.categories.filter(i => i.id !== this.id)
      },
      error => {
        this.loading = false
        this.categoryForm = this.initForm()
        this.closeModal()
        Swal.fire('Suppression', error.error.message, 'error');
      }
    )
  }

  updateCategory() {
    let _data = {
      "designation": this.designation?.value,
      "unite": this.unitee?.value,
    }
    this.loading = true
    this._categorieService.updateCategory(this.id, _data).subscribe(
      data => {
        this.categoryForm = this.initForm()
        this.closeModal()
        this.successmsg("Categorie modifier", "Vous venez modifier le Categorie")
        this.categories = this.categories.map(i => i.id !== this.id ? i : data)
        this.loading = false
      },
      error => {
        this.loading = false
        this.categoryForm?.get("categorie")?.setErrors({ 'unique': functionsService.getHisError(error.error.errors, "categorie") })
      }
    )
  }

  get categorie() {
    return this.categoryForm?.get('categorie')
  }
  get idCategorie() {
    return this.categorie?.get('id')
  }

  show(category: Category) {
    this.router.navigate(['/paie/categorie/' + category.id])
  }

}

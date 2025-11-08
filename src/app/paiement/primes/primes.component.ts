import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypePrime } from '../models/type-prime';
import { Prime } from '../models/prime';
import { Poste } from '../models/poste';
import { Category } from '../models/category';
import { PrimeService } from '../services/prime.service';
import { PosteService } from '../services/poste.service';
import { CategorieService } from '../services/categorie.service';
import { TypePrimeService } from '../services/type-prime.service';

@Component({
  selector: 'app-primes',
  templateUrl: './primes.component.html',
  styleUrls: ['./primes.component.scss']
})
export class PrimesComponent implements OnInit {

  public primes:Prime[] = [];
  public typePrimes:TypePrime[]= [];
  public postes:Poste[] = [];
  public categories:Category[] = [];
  public primeForm!: FormGroup;
  public perPage:number = 10;
  public p: number = 1;
  public loading:boolean = false;
  public id:number = 0;


  items: any[] = [];

  constructor(private router:Router, private  _primeService:PrimeService, private  _posteService:PosteService, private _categorieService:CategorieService, private  _typePrimeService:TypePrimeService,  private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.primeForm = this.initForm()
    this._primeService.getPrimes().subscribe((data:any) => this.primes = data)
    this._typePrimeService.getTypePrimes().subscribe((data:any) => this.typePrimes = data)
    this._posteService.getPostes().subscribe((data:any) => this.postes = data)
    this._categorieService.getCategories().subscribe((data:any) => this.categories = data)
  
     this.items = [
      { label: 'Paiement' },
      { label: 'Primes', active: true },
    ];
  
  }

  initForm(prime?:Prime, type = "poste"):FormGroup {
    return new FormGroup({
      montant: new FormControl(prime != null ? prime.montant : "", Validators.compose([Validators.required])),
      typePrime: new FormControl(prime != null && prime.typePrime ? prime.typePrime.id : "", Validators.compose([Validators.required])),
      poste: new FormControl(prime != null && prime.poste ? prime.poste.id : ""),
      categorie: new FormControl(prime != null && prime.categorie ? prime.categorie.id : ""),
      type: new FormControl(type, [Validators.required])
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

  successmsg(title = 'Prime ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau prime !') {
    Swal.fire(title, message, 'success');
  }

  clear() {
    this.primeForm = this.initForm()
  }

  createPrime() {
    let _data = {
      "montant": this.montant?.value,
      "typePrime": this.typePrime?.value,
      "poste": this.poste?.value,
      "categorie": this.categorie?.value,
    }
    this.loading = true
    this._primeService.createPrime(_data).subscribe(
      (data:any) => {
        this.primeForm = this.initForm()
        this.closeModal()
        this.successmsg()
        this.primes.push(data)
        this.loading = false
      },
      error => {
        this.loading = false
      }
    )
  }

  initAction(prime:Prime |null, action:string="delete", content:any) {
    this.openModal(content)
    this.primeForm = this.initForm(prime!)
    if (prime != null) {
      this.id = prime.id
      if (prime.categorie != null) {
        this.primeForm = this.initForm(prime, "categorie")
      } else {
        this.primeForm = this.initForm(prime, "poste")
      }
    }
  }

  deletePrime() {
    this.loading = true
    this._primeService.deletePrime(this.id).subscribe(
      (data:any) => {
        this.primeForm = this.initForm()
        this.closeModal()
        this.successmsg("Prime supprimer", "Le prime a été bien supprimé avec succès")
        this.loading = false
        this.primes = this.primes.filter(i => i.id !== this.id)
      },
      error => {
        this.loading = false
        this.primeForm = this.initForm()
        this.closeModal()
        Swal.fire('Suppression', error.error.message, 'error');
      }
    )
  }

  updatePrime() {
    let _data = {
      "montant": this.montant?.value,
      "typePrime": this.typePrime?.value,
      "poste": this.poste?.value,
      "categorie": this.categorie?.value,
    }
    this.loading = true
    this._primeService.updatePrime(this.id, _data).subscribe(
      (data:any) => {
        this.primeForm = this.initForm()
        this.closeModal()
        this.successmsg("Prime modifier", "Vous venez modifier le prime ")
        this.primes = this.primes.map(i => i.id !== this.id ? i : data)
        this.loading = false
      },
      error => {
        this.loading = false
      }
    )
  }

  get montant() {
    return this.primeForm?.get('montant')
  }

  get typePrime() {
    return this.primeForm?.get('typePrime')
  }

  get poste() {
    if (this.primeForm?.get('poste')?.value != "") {
      this.primeForm?.get('poste')?.clearValidators()
    }
    return this.primeForm?.get('poste')
  }

  get categorie() {
    if (this.primeForm?.get('categorie')?.value != "") {
      this.primeForm?.get('categorie')?.clearValidators()
    }
    return this.primeForm?.get('categorie')
  }

  get type() {
    if (this.primeForm?.get("type")?.value == "poste") {
      this.poste?.addValidators(Validators.required)
      this.categorie?.setValue(null)
    } else {
      this.categorie?.addValidators(Validators.required)
      this.poste?.setValue(null)
    }
    return this.primeForm?.get("type")
  }

  show(prime:Prime) {
    this.router.navigate(['/paie/primes/'+prime.id])
  }

}

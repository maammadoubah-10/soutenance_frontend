import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Banque } from '../models/banque';
import { BanqueService } from '../services/banque.service';

@Component({
  selector: 'app-banques',
  templateUrl: './banques.component.html',
  styleUrls: ['./banques.component.scss'],
})
export class BanquesComponent implements OnInit {
   items: any[] = [];
  public banques:Banque[] = [];
  public banqueForm?: FormGroup;
  public perPage:number = 10;
  public p: number = 1;
  public loading:boolean = false;
  public id:number= 0;

  constructor(private router:Router, private  _banqueService:BanqueService, private modalService: NgbModal, private fb: FormBuilder) {
      this.banqueForm = this.initForm();
  }

  ngOnInit(): void {
      this.items = [
      { label: 'Paiement' },
      { label: 'Banque', active: true },
    ];
    this.banqueForm = this.initForm()
    // this._banqueService.getBanques().subscribe((data: Banque[]) => this.banques = data)

    this._banqueService.getBanques().subscribe((response: any) => {
    this.banques = response.content; // Extraire le tableau des banques
  });
  }

  initForm(banque?: Banque): FormGroup {
    return this.fb.group({
      sigle: [banque?.sigle || '', Validators.required],
      designation: [banque?.designation || '', Validators.required],
    });
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

  successmsg(title = 'banque ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau banque !') {
    Swal.fire(title, message, 'success');
  }

  clear() {
    this.banqueForm = this.initForm()
  }

  createBanque() {
    let _data = {
      "sigle": this.sigle?.value,
      "designation": this.designation?.value,
    }
    this.loading = true
    this._banqueService.createBanque(_data).subscribe(
      (      data: any) => {
        this.banqueForm = this.initForm()
        this.closeModal()
        this.successmsg()
        this.banques.push(data)
        this.loading = false
      },
      (      error: any) => {
        this.loading = false
      }
    )
  }

initAction(banque: Banque | null, action: string = "delete", content: any) {
  this.openModal(content);
  if (banque != null) {
    this.id = banque.id;
  }
  this.banqueForm = this.initForm(banque!);
}

  deleteBanque() {
    this.loading = true
    this._banqueService.deleteBanque(this.id).subscribe(
      (      data: any) => {
        this.banqueForm = this.initForm()
        this.closeModal()
        this.successmsg("banque supprimer", "Le banque a été bien supprimé avec succès")
        this.loading = false
        this.banques = this.banques.filter(i => i.id !== this.id)
      },
      (      error: any) => {
        this.loading = false
      }
    )
  }

  updateBanque() {
    let _data = {
      "sigle": this.sigle?.value,
      "designation": this.designation?.value,
    }
    this.loading = true
    this._banqueService.updateBanque(this.id, _data).subscribe(
      (      data: any) => {
        this.banqueForm = this.initForm()
        this.closeModal()
        this.successmsg("banque modifier", "Vous venez modifier le banque ")
        this.banques = this.banques.map(i => i.id !== this.id ? i : data)
        this.loading = false
      },
      (      error: any) => {
        this.loading = false
      }
    )
  }

  get sigle() {
    return this.banqueForm?.get('sigle')
  }

  get designation() {
    return this.banqueForm?.get('designation')
  }

  show(banque:Banque) {
    this.router.navigate(['/paie/banque/'+banque.id])
  }


}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeEtat } from '../models/type-etat';
import { TypeEtatService } from '../services/type-etat.service';
import functionsService from '../services/functions.service';

@Component({
  selector: 'app-type-etats',
  templateUrl: './type-etats.component.html',
  styleUrls: ['./type-etats.component.scss']
})
export class TypeEtatsComponent implements OnInit {
  items: any[] = [];
  public typeEtats:TypeEtat[] = [];
  public typeEtatForm!: FormGroup;
  public perPage:number = 10;
  public p: number = 1;
  public loading:boolean = false;
  public id:number=0;

  constructor(private router:Router, private  _typeEtatService:TypeEtatService, private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.typeEtatForm = this.initForm()
    this._typeEtatService.getTypeEtats().subscribe(
      (data:any) =>  {
        this.typeEtats = data.content;
        this.typeEtats = data.content || [];
      }, (error)=>{
        console.log(error);
      }, ()=>{
        console.log("Terminer");
        
      }
    )
    this.items = [
      { label: 'Paiement' },
      { label: 'Type Etat', active: true },
    ];
    
  }
  

  initForm(typeEtat?:TypeEtat):FormGroup {
    return new FormGroup({
      designation: new FormControl(typeEtat != null ? typeEtat.designation : "", Validators.compose([Validators.required])),
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

  successmsg(title = 'Type etat ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau Type etat !') {
    Swal.fire(title, message, 'success');
  }

  clear() {
    this.typeEtatForm = this.initForm()
  }

  createTypeEtat() {
    let _data = {
      "designation": this.designation?.value,
    }
    this.loading = true
    this._typeEtatService.createTypeEtat(_data).subscribe(
      data => {
        this.typeEtatForm = this.initForm()
        this.closeModal()
        this.successmsg()
        this.typeEtats.push(data)
        this.loading = false
      },
      error => {
        this.loading = false
        this.typeEtatForm?.get("designation")?.setErrors({'unique': functionsService.getHisError(error.error.errors, "designation")})
      }
    )
  }

  initAction(typeEtat:TypeEtat | null, action:string="delete", content:any) {
    this.openModal(content)
    if (typeEtat != null) {
      this.id = typeEtat.id
    }
    this.typeEtatForm = this.initForm(typeEtat!)
  }

  deleteTypeEtat() {
    this.loading = true
    this._typeEtatService.deleteTypeEtat(this.id).subscribe(
      data => {
        this.typeEtatForm = this.initForm()
        this.closeModal()
        this.successmsg("type etat supprimer", "Le type etat a été bien supprimé avec succès")
        this.loading = false
        this.typeEtats = this.typeEtats.filter(i => i.id !== this.id)
      },
      error => {
        this.loading = false
        this.typeEtatForm = this.initForm()
        this.closeModal()
        Swal.fire('Suppression', error.error.message, 'error');
      }
    )
  }

  updateTypeEtat() {
    let _data = {
      "designation": this.designation?.value,
    }
    this.loading = true
    this._typeEtatService.updateTypeEtat(this.id, _data).subscribe(
      data => {
        this.typeEtatForm = this.initForm()
        this.closeModal()
        this.successmsg("Type etat modifier", "Vous venez modifier le type etat ")
        this.typeEtats = this.typeEtats.map(i => i.id !== this.id ? i : data)
        this.loading = false
      },
      error => {
        this.loading = false
        this.typeEtatForm?.get("designation")?.setErrors({'unique': functionsService.getHisError(error.error.errors, "designation")})
      }
    )
  }

  get designation() {
    return this.typeEtatForm?.get('designation')
  }

  show(typeEtat:TypeEtat) {
    this.router.navigate(['/paie/type/etat/'+typeEtat.id])
  }

}

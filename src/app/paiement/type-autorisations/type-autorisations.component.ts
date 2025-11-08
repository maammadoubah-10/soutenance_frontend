import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeAutorisation } from '../models/type-autorisation';
import { TypeAutorisationService } from '../services/type-autorisation.service';
import functionsService from '../services/functions.service';

@Component({
  selector: 'app-type-autorisations',
  templateUrl: './type-autorisations.component.html',
  styleUrls: ['./type-autorisations.component.scss']
})
export class TypeAutorisationsComponent implements OnInit {

  public typeAutorisations:TypeAutorisation[] = [];
  public typeAutorisationForm!: FormGroup;
  public perPage:number = 10;
  public p: number = 1;
  public loading:boolean = false;
  public id:number = 0;
  items: any[] = [];

  constructor(private router:Router, private  _typeAutorisationService:TypeAutorisationService, private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.typeAutorisationForm = this.initForm()
    this._typeAutorisationService.getTypeAutorisations().subscribe(
      (data:any) =>  {
        this.typeAutorisations = data.content;
        this.typeAutorisations = data.content || [];
      }, (error)=>{
        console.log(error);
      }, ()=>{
        console.log("Terminer");
        
      }
      )

        this.items = [
      { label: 'Paiement' },
      { label: 'TypeAutorisations', active: true },
    ];
  }

  initForm(typeAutorisation?:TypeAutorisation):FormGroup {
    return new FormGroup({
      id: new FormControl(typeAutorisation != null ? typeAutorisation.designation : null),
      designation: new FormControl(typeAutorisation != null ? typeAutorisation.designation : "", Validators.compose([Validators.required])),
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

  successmsg(title = 'Type Autorisation ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau type d\'autorisation !') {
    Swal.fire(title, message, 'success');
  }

  clear() {
    this.typeAutorisationForm = this.initForm()
  }

  traiteFormTypeAutorisation(){
    if(this.typeAutorisationForm.get('id')?.value == null){
      this.createTypeAutorisation()
    } else{
      this.updateTypeAutorisation()
    }
  }

  createTypeAutorisation() {
    let _data = {
      "designation": this.designation?.value,
    }
    this.loading = true
    this._typeAutorisationService.createTypeAutorisation(_data).subscribe(
      data => {
        this.typeAutorisationForm = this.initForm()
        this.closeModal()
        this.successmsg()
        this.typeAutorisations.unshift(data)
        this.loading = false
      },
      error => {
        this.loading = false
        this.typeAutorisationForm.get("designation")?.setErrors({'unique': functionsService.getHisError(error.error.errors, "designation")})
      }
    )
  }

  initAction(typeAutorisation:TypeAutorisation | null, action:string="delete", content:any) {
    this.openModal(content)
    if (typeAutorisation != null) {
      this.id = typeAutorisation.id
    }
    this.typeAutorisationForm = this.initForm(typeAutorisation!)
  }

  deleteTypeAutorisation() {
    this.loading = true
    this._typeAutorisationService.deleteTypeAutorisation(this.id).subscribe(
      data => {
        this.typeAutorisationForm = this.initForm()
        this.closeModal()
        this.successmsg("Type Autorisation supprimer", "Le Type d'autorisation a été bien supprimé avec succès")
        this.loading = false
        this.typeAutorisations = this.typeAutorisations.filter(i => i.id !== this.id)
      },
      error => {
        this.loading = false
        this.typeAutorisationForm = this.initForm()
        this.closeModal()
        Swal.fire('Suppression', error.error.message, 'error');
      }
    )
  }

  updateTypeAutorisation() {
    let _data = {
      "designation": this.designation?.value,
    }
    this.loading = true
    this._typeAutorisationService.updateTypeAutorisation(this.id, _data).subscribe(
      data => {
        this.typeAutorisationForm = this.initForm()
        this.closeModal()
        this.successmsg("Type Autorisation modifier", "Vous venez modifier le type d'autorisation ")
        this.typeAutorisations = this.typeAutorisations.map(i => i.id !== this.id ? i : data)
        this.loading = false
      },
      error => {
        this.loading = false
        this.typeAutorisationForm.get("designation")?.setErrors({'unique': functionsService.getHisError(error.error.errors, "designation")})
      }
    )
  }

  get designation() {
    return this.typeAutorisationForm.get('designation')
  }

  show(typeAutorisation:TypeAutorisation) {
    this.router.navigate(['/paie/type/etat/'+typeAutorisation.id])
  }

}

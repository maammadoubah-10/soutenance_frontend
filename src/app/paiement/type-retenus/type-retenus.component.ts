import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeRetenu } from '../models/type-retenu';
import { TypeRetenuService } from '../services/type-retenu.service';
import functionsService from '../services/functions.service';
import { CommunModule } from "../../commun/commun.module";

@Component({
  selector: 'app-type-retenus',
  templateUrl: './type-retenus.component.html',
  styleUrls: ['./type-retenus.component.scss'],
})
export class TypeRetenusComponent implements OnInit {
    items: any[] = [];
  public typeRetenus:TypeRetenu[] = [];
  public typeRetenuForm?: FormGroup;
  public perPage:number = 10;
  public p: number = 1;
  public loading:boolean = false;
  public id:number = 0;

  constructor(private router:Router, private  _typeRetenuService:TypeRetenuService, private modalService: NgbModal, private fb: FormBuilder) {
    this.typeRetenuForm = this.initForm();
  }

  ngOnInit(): void {
    this.typeRetenuForm = this.initForm()
    this._typeRetenuService.getTypeRetenus().subscribe((data: any)  =>{
      this.typeRetenus = data['content']      
      }, (error)=>{
        console.log(error);
      },()=>{
        console.log("Terminé");
      }
    )
     this.items = [
      { label: 'Paiement' },
      { label: 'Type Retenu', active: true },
    ];
  }

  initForm(typeRetenu?:TypeRetenu): FormGroup{
    return new FormGroup({
      id: new FormControl(typeRetenu != null ? typeRetenu.id : null),
      designation: new FormControl(typeRetenu != null ? typeRetenu.designation : "", Validators.compose([Validators.required])),
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

  successmsg(title = 'Type de retenu ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau Type de retenu !') {
    Swal.fire(title, message, 'success');
  }

  clear() {
    this.typeRetenuForm = this.initForm()
  }

  traiteFormTypeRetenu(){
    if(this.typeRetenuForm?.get('id')?.value == null){
      this.createTypeRetenu()
    }else {
      this.updateTypeRetenu()
    }
  }

  createTypeRetenu() {
    let _data = {
      "designation": this.designation?.value,
    }
    this.loading = true
    this._typeRetenuService.createTypeRetenu(_data).subscribe(
      data => {
        this.typeRetenuForm = this.initForm()
        this.closeModal()
        this.successmsg()
        this.typeRetenus.push(data)
        this.loading = false
      },
      error => {
        this.loading = false
        console.log(error);
        this.typeRetenuForm?.get("designation")?.setErrors({'unique': functionsService.getHisError(error.error.errors, "designation")})
      }
    )
  }

  initAction(typeRetenu:TypeRetenu | null, action:string="delete", content:any) {
    this.openModal(content)
    if (typeRetenu != null) {
      this.id = typeRetenu.id
    }
    this.typeRetenuForm = this.initForm(typeRetenu!)
  }

  deleteTypeRetenu() {
    this.loading = true
    this._typeRetenuService.deleteTypeRetenu(this.id).subscribe(
      data => {
        this.typeRetenuForm = this.initForm()
        this.closeModal()
        this.successmsg("Type de retenu supprimer", "Le Type de retenu a été bien supprimé avec succès")
        this.loading = false
        this.typeRetenus = this.typeRetenus.filter(i => i.id !== this.id)
      },
      error => {
        this.loading = false
        this.typeRetenuForm = this.initForm()
        this.closeModal()
        Swal.fire('Suppression', error.error.message, 'error');
      }
    )
  }

  updateTypeRetenu() {
    let _data = {
      "designation": this.designation?.value,
    }
    this.loading = true
    this._typeRetenuService.updateTypeRetenu(this.id, _data).subscribe(
      data => {
        this.typeRetenuForm = this.initForm()
        this.closeModal()
        this.successmsg("Type de retenu modifier", "Vous venez modifier le Type de retenu ")
        this.typeRetenus = this.typeRetenus.map(i => i.id !== this.id ? i : data)
        this.loading = false
      },
      error => {
        this.loading = false
        this.typeRetenuForm?.get("designation")?.setErrors({'unique': functionsService.getHisError(error.error.errors, "designation")})
      }
    )
  }

  get designation() {
    return this.typeRetenuForm?.get('designation')
  }

  show(typeRetenu:TypeRetenu) {
    this.router.navigate(['/paie/type/retenu/'+typeRetenu.id])
  }

}

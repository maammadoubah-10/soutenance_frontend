import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { TypeImpact } from '../../state/state';
import { TypeImpactSalarialService } from '../services/type-impact-salarial.service';
import { TypeImpactSalarial } from '../models/type-impact-salarial';
import functionsService from '../services/functions.service';
import { PageResponse } from '../models/PageResponse';

@Component({
  selector: 'app-type-impact-salarial',
  templateUrl: './type-impact-salarial.component.html',
  styleUrls: ['./type-impact-salarial.component.scss']
})
export class TypeImpactSalarialComponent implements OnInit {
  items: any[] = [];
  public typeImpactSalarials: any = [];
  public typeImpactSalarialForm!: FormGroup;
  public loading:boolean = false;
  public totalItems: number = 0;
  public p: number = 1;
  public currentPage: number = 1;
  public perPage: number = 10;
  public id:number = 0;
  public types = TypeImpact

  constructor(private router:Router, private  _typeImpactSalarialervice: TypeImpactSalarialService, private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.typeImpactSalarialForm = this.initForm()
    this.chargerTypeImpactSalarials(0, this.perPage);

     this.items = [
      { label: 'Paiement' },
      { label: 'Types Impact Salarial', active: true },
    ];

  }

 chargerTypeImpactSalarials(page: number, size: number) {
    this.loading = true;
    
    this._typeImpactSalarialervice.gettypeImpactSalarial(page, size).subscribe({
      next: (response: any) => {
        this.typeImpactSalarials = response.content || [];
        this.totalItems = response.totalElements || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur:', error);
        this.typeImpactSalarials = [];
        this.totalItems = 0;
        this.loading = false;
      }
    });
  }

  onPageChange(event:any): void {
    this.chargerTypeImpactSalarials(event, this.perPage);
  }

  initForm(TypeImpactSalarial?:TypeImpactSalarial):FormGroup{
    return new FormGroup({
      id: new FormControl(TypeImpactSalarial != null ? TypeImpactSalarial.id : null),
      designation: new FormControl(TypeImpactSalarial != null ? TypeImpactSalarial.designation : "", Validators.compose([Validators.required])),
      type: new FormControl(TypeImpactSalarial != null ? TypeImpactSalarial.type : this.types.PRIME, Validators.compose([Validators.required])),
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

  successmsg(title = 'Type d\'impact salarial ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau Type d\'impact salarial !') {
    Swal.fire(title, message, 'success');
  }

  clear() {
    this.typeImpactSalarialForm = this.initForm()
  }

  traiteFormTypeImpactSalarial(){
    if(this.typeImpactSalarialForm?.get('id')?.value == null){
      this.createTypeImpactSalarial()
    } else {
      this.updateTypeImpactSalarial()
    }
  }

  createTypeImpactSalarial() {
    let _data = {
      "type": this.type?.value,
      "designation": this.designation?.value,
    }
    this.loading = true
    this._typeImpactSalarialervice.createTypeImpactSalarial(_data).subscribe(
     (data:any) => {
        this.typeImpactSalarialForm = this.initForm()
        this.closeModal()
        this.successmsg()
        this.typeImpactSalarials.unshift(data)
        this.loading = false
      },
      error => {
        this.loading = false
        this.typeImpactSalarialForm?.get("designation")?.setErrors({'unique': functionsService.getHisError(error.error.errors, "designation")})
      }
    )
  }

  initAction(TypeImpactSalarial:TypeImpactSalarial | null, action:string="delete", content:any) {
    this.openModal(content)
    if (TypeImpactSalarial != null) {
      this.id = TypeImpactSalarial.id
    }
    this.typeImpactSalarialForm = this.initForm(TypeImpactSalarial!)
  }

  deleteTypeImpactSalarial() {
    this.loading = true
    this._typeImpactSalarialervice.deleteTypeImpactSalarial(this.id).subscribe(
      data => {
        this.typeImpactSalarialForm = this.initForm()
        this.closeModal()
        this.successmsg("Type d'impact salarial supprimer", "Le Type d'impact salarial a été bien supprimé avec succès")
        this.loading = false
        this.typeImpactSalarials = this.typeImpactSalarials.filter((i:any) => i.id !== this.id)
      },
      error => {
        this.loading = false
        this.typeImpactSalarialForm = this.initForm()
        this.closeModal()
        Swal.fire('Suppression', error.error.message, 'error');
      }
    )
  }

  updateTypeImpactSalarial() {
    let _data = {
      "type": this.type?.value,
      "designation": this.designation?.value,
    }
    this.loading = true
    this._typeImpactSalarialervice.updateTypeImpactSalarial(this.id, _data).subscribe(
      data => {
        this.typeImpactSalarialForm = this.initForm()
        this.closeModal()
        this.successmsg("Type d'impact salarial modifier", "Vous venez modifier le Type d'impact salarial ")
        this.typeImpactSalarials = this.typeImpactSalarials.map((i:any)=> i.id !== this.id ? i : data)
        this.loading = false
      },
      error => {
        this.loading = false
        this.typeImpactSalarialForm?.get("designation")?.setErrors({'unique': functionsService.getHisError(error.error.errors, "designation")})
      }
    )
  }

  get designation() {
    return this.typeImpactSalarialForm?.get('designation')
  }

  get type(){
    return this.typeImpactSalarialForm?.get('type')
  }

  show(TypeImpactSalarial:TypeImpactSalarial) {
    this.router.navigate(['/paie/type/retenu/'+TypeImpactSalarial.id])
  }

}

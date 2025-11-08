
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Echelon } from '../models/echelon';
import { EchelonService } from '../services/echelon.service';
import functionsService from '../services/functions.service';
import { UniteService } from '../services/unite.service';
import { Unite } from '../models/unite';

@Component({
  selector: 'app-echelons',
  templateUrl: './echelons.component.html',
  styleUrls: ['./echelons.component.scss']
})
export class EchelonsComponent implements OnInit {
  items: any[] = [];
  public echelons:Echelon[] = [];
  public unite:Unite[] = [];
  public echelonForm!: FormGroup;
  public perPage:number = 10;
  public p: number = 1;
  public loading:boolean = false;
  public id:number= 0;

  constructor(
    private router:Router,
    private _echelonService:EchelonService, 
    private modalService: NgbModal,
    private uniteService:UniteService,
    ) {
  }

  ngOnInit(): void {
      this.echelonForm = this.initForm()
      // this._echelonService.getEchelons().subscribe((data:any) => {
      // this.echelons = data['content']
      // console.log(this.echelons);
      // }
    //)
    this.loadEchelons();

     this.uniteService.listerUnitePage().subscribe((response: any) => {
    this.unite = response.content; // Extraire le tableau des banques
  },(error)=>{
        console.log(error);
      },()=>{
        console.log("Terminé");
      }
    )

 this.items = [
      { label: 'Paiement' },
      { label: 'Echelons', active: true },
    ];
  }

   loadEchelons() {
    this._echelonService.getEchelons().subscribe({
      next: (data: any) => {
        console.log('Données complètes:', data);
        console.log('Content:', data.content);
        
        // Vérifier la structure d'un élément
        if (data.content && data.content.length > 0) {
          console.log('Premier élément:', data.content[0]);
          console.log('Propriétés disponibles:', Object.keys(data.content[0]));
        }
        
        this.echelons = data.content || [];
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.echelons = [];
      }
    });
  }

  initForm(echelon?:Echelon):FormGroup {
    return new FormGroup({
      id: new FormControl(echelon != null ? echelon.id : null),
      echelon: new FormControl(echelon != null ? echelon.echelon : "", Validators.compose([Validators.required])),
      designation: new FormControl(echelon != null ? echelon.designation : "", Validators.compose([Validators.required])),
      unite: new FormControl(echelon != null && echelon.unite ? echelon.unite.id : "", Validators.compose([Validators.required])),
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

  successmsg(title = 'Echelon ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau echelon !') {
    Swal.fire(title, message, 'success');
  }

  clear() {
    this.echelonForm = this.initForm()
  }

  traiteformEchelon(){
    if(this.echelonForm.get('id')?.value == null ){
      this.createEchelon()
    }else{
      this.updateEchelon()
    }
  }

  createEchelon() {
    let _data = {
      "echelon": this.echelon?.value,
      "designation": this.designation?.value,
      "unite": this.unitee?.value,
    } 
    this.loading = true
    this._echelonService.createEchelon(_data).subscribe(
      (data:any) => {
        this.echelonForm = this.initForm()
        this.closeModal()
        this.successmsg()
        this.echelons.unshift(data)
        this.loading = false
      },
      error => {
        this.loading = false
        this.echelonForm.get("echelon")?.setErrors({'unique': functionsService.getHisError(error.error.errors, "echelon")})
      }
    )
  }

  get unitee() {
    return this.echelonForm?.get('unite')
  }

  initAction(echelon:Echelon |null, action:string="delete", content:any) {
    this.openModal(content)
    if (echelon != null) {
      this.id = echelon.id
    }
    this.echelonForm = this.initForm(echelon!)
  }

  deleteEchelon() {
    this.loading = true
    this._echelonService.deleteEchelon(this.id).subscribe(
      (data:any) => {
        this.echelonForm = this.initForm()
        this.closeModal()
        this.successmsg("Echelon supprimer", "Le echelon a été bien supprimé avec succès")
        this.loading = false
        this.echelons = this.echelons.filter(i => i.id !== this.id)
      },
      error => {
        this.loading = false
        this.echelonForm = this.initForm()
        this.closeModal()
        Swal.fire('Suppression', error.error.message, 'error');
      }
    )
  }

  updateEchelon() {
    let _data = {
      "echelon": this.echelon?.value,
      "designation":this.designation?.value,
      "unite": this.unitee?.value,
    }
    this.loading = true
    this._echelonService.updateEchelon(this.id, _data).subscribe(
      (data:any) => {
        this.echelonForm = this.initForm()
        this.closeModal()
        this.successmsg("Echelon modifier", "Vous venez modifier le echelon ")
        this.echelons = this.echelons.map(i => i.id !== this.id ? i : data)
        this.loading = false
      },
      error => {
        this.loading = false
        this.echelonForm.get("echelon")?.setErrors({'unique': functionsService.getHisError(error.error.errors, "echelon")})
      }
    )
  }

  get echelon() {
    return this.echelonForm.get('echelon')
  }

  get designation() {
    return this.echelonForm.get('designation')
  }

  show(echelon:Echelon) {
    this.router.navigate(['/paie/echelon/'+echelon.id])
  }

}

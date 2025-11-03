import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Personnel } from '../models/personnel';
import { TypeRetenu } from '../models/type-retenu';
import { Retenu } from '../models/retenu';
import { RetenuService } from '../services/retenu.service';
import { TypeRetenuService } from '../services/type-retenu.service';
import { PersonnelService } from '../services/personnel.service';
@Component({
  selector: 'app-retenus',
  templateUrl: './retenus.component.html',
  styleUrls: ['./retenus.component.scss']
})
export class RetenusComponent implements OnInit {
  items: any[] = [];

  public retenus:Retenu[] = [];
  public typeRetenus:TypeRetenu[] = [];
  public personnels:Personnel[] = [];
  public retenuForm?: FormGroup;
  public perPage:number = 10;
  public p: number = 1;
  public loading:boolean = false;
  public id:number =0;

  constructor(private router:Router,
     private  _retenuService:RetenuService,
      private  _typeRetenuService:TypeRetenuService,
      private _personnelService:PersonnelService, 
      private modalService: NgbModal,
   private fb: FormBuilder) {
 this.retenuForm = this.initForm();
  }

  ngOnInit(): void {
    this.retenuForm = this.initForm()
    this.loadRetenus();
  //  this._retenuService.getRetenus().subscribe((data: any) => {
  //     console.log('Réponse complète:', data);
  //     console.log('Content:', data.content);
  //     this.retenus = data.content;
  //     console.log('Retenus après assignation:', this.retenus);
  //   }, (error) => {
  //     console.log('Erreur:', error);
  //   });

   this._personnelService.getPersonnels().subscribe((response: any) => {
    this.personnels = response.content; // Extraire le tableau des banques
  },(error)=>{
        console.log(error);
      },()=>{
        console.log("Terminé");
      }
    )

    this._typeRetenuService.getTypeRetenus().subscribe((data:any) =>{
      this.typeRetenus = data['content']
      } ,(error)=>{
        console.log(error);
      },()=>{
        console.log("Terminé");
      }
    )

     this.items = [
      { label: 'Paiement' },
      { label: 'Retenus', active: true },
    ];
  }

  loadRetenus() {
    this._retenuService.getRetenus().subscribe({
      next: (data: any) => {
        console.log('Données complètes:', data);
        console.log('Content:', data.content);
        
        // Vérifier la structure d'un élément
        if (data.content && data.content.length > 0) {
          console.log('Premier élément:', data.content[0]);
          console.log('Propriétés disponibles:', Object.keys(data.content[0]));
        }
        
        this.retenus = data.content || [];
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.retenus = [];
      }
    });
  }


  initForm(retenu?:Retenu):FormGroup {
    return new FormGroup({
      id: new FormControl(retenu != null ? retenu.id : null),
      montant: new FormControl(retenu != null ? retenu.montant : "", Validators.compose([Validators.required])),
      nombreMoisRemboursement: new FormControl(retenu != null ? retenu.nombreMoisRemboursement : "", Validators.compose([Validators.required])),
      typeRetenu: new FormControl(retenu != null && retenu.typeRetenu ? retenu.typeRetenu.id : "", Validators.compose([Validators.required])),
      personnel: new FormControl(retenu != null && retenu.personnel ? retenu.personnel.id : "", Validators.compose([Validators.required])),
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

  successmsg(title = 'Retenu ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau retenu !') {
    Swal.fire(title, message, 'success');
  }

  clear() {
    this.retenuForm = this.initForm()
  }

  traiteFormRetenu(){
    if(this.retenuForm?.get('id')?.value == null){
      this.createRetenu()
    } else{
      this.updateRetenu()
    }
  }

  createRetenu() {
    let _data = {
      "montant": this.montant?.value,
      "nombreMoisRemboursement": this.nombreMoisRemboursement?.value,
      "personnel": this.personnel?.value,
      "typeRetenu": this.typeRetenu?.value,
    }
    this.loading = true
    this._retenuService.createRetenu(_data).subscribe(
      (data:any) => {
        this.retenuForm = this.initForm()
        this.closeModal()
        this.successmsg()
        this.retenus.push(data)
        this.loading = false
      },
      error => {
        this.loading = false
      }
    )
  }

  initAction(retenu:Retenu | null, action:string="delete", content:any) {
    this.openModal(content)
    if (retenu != null) {
      this.id = retenu.id
    }
    this.retenuForm = this.initForm(retenu!)
  }

  deleteRetenu() {
    this.loading = true
    this._retenuService.deleteRetenu(this.id).subscribe(
      (data:any) => {
        this.retenuForm = this.initForm()
        this.closeModal()
        this.successmsg("Retenu supprimer", "Le retenu a été bien supprimé avec succès")
        this.loading = false
        this.retenus = this.retenus.filter(i => i.id !== this.id)
      },
      error => {
        this.loading = false
      }
    )
  }

  updateRetenu() {
    let _data = {
      "montant": this.montant?.value,
      "nombreMoisRemboursement": this.nombreMoisRemboursement?.value,
      "personnel": this.personnel?.value,
      "typeRetenu": this.typeRetenu?.value,
    }
    this.loading = true
    this._retenuService.updateRetenu(this.id, _data).subscribe(
      (data:any) => {
        this.retenuForm = this.initForm()
        this.closeModal()
        this.successmsg("Retenu modifier", "Vous venez modifier le retenu ")
        this.retenus = this.retenus.map(i => i.id !== this.id ? i : data)
        this.loading = false
      },
      error => {
        this.loading = false
      }
    )
  }

  get montant() {
    return this.retenuForm?.get('montant')
  }

  get personnel() {
    return this.retenuForm?.get('personnel')
  }

  get typeRetenu() {
    return this.retenuForm?.get('typeRetenu')
  }

  get nombreMoisRemboursement() {
    return this.retenuForm?.get('nombreMoisRemboursement')
  }

  show(retenu:Retenu) {
    this.router.navigate(['/paie/retenu/'+retenu.id])
  }

}

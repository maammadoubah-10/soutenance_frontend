
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeAutorisation } from '../models/type-autorisation';
import { Personnel } from '../models/personnel';
import { Autorisation } from '../models/autorisation';
import { AutorisationService } from '../services/autorisation.service';
import { PersonnelService } from '../services/personnel.service';
import { TypeAutorisationService } from '../services/type-autorisation.service';
@Component({
  selector: 'app-autorisations',
  templateUrl: './autorisations.component.html',
  styleUrls: ['./autorisations.component.scss']
})
export class AutorisationsComponent implements OnInit {
  items: any[] = [];
  public autorisations:Autorisation[] = [];
  public personnels:Personnel[] = [];
  public typeAutorisations:TypeAutorisation[] = [];
  public autorisationForm!: FormGroup;
  public perPage:number = 10;
  public p: number = 1;
  public loading:boolean = false;
  public id:number = 0;

  constructor(private router:Router, private _autorisationService:AutorisationService, private _personnelService:PersonnelService, private _typeAutorisationService:TypeAutorisationService, private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.autorisationForm = this.initForm()
    this._autorisationService.getAutorisations().subscribe((data:any) => {
        this.autorisations = data['content']
      },(error)=>{
        console.log(error);
      },()=>{
        console.log("Terminer");
      }
    )

      this.items = [
      { label: 'Paiement' },
      { label: 'Autorisations', active: true },
    ];

    this._personnelService.getPersonnels().subscribe((response: any) => {
    this.personnels = response.content; // Extraire le tableau des banques
  },(error)=>{
        console.log(error);
      },()=>{
        console.log("Terminé");
      }
    )


    this._typeAutorisationService.getTypeAutorisations().subscribe((data:any) =>{
        this.typeAutorisations = data.content;
        this.typeAutorisations = data.content || [];
      },(error)=>{
        console.log(error);
      },()=>{
        console.log("Terminer");
      }
    )
  }

  initForm(autorisation?:Autorisation):FormGroup {
    return new FormGroup({
      id: new FormControl(autorisation != null && autorisation.personnel ? autorisation.id : null),
      dateDebut: new FormControl(autorisation != null ? this.setDateDirection(autorisation.dateDebut) : "", Validators.compose([Validators.required])),
      dateFin: new FormControl(autorisation != null ? this.setDateDirection(autorisation.dateFin) : "", Validators.compose([Validators.required])),
      observation: new FormControl(autorisation != null ? autorisation.observation : "", Validators.compose([Validators.required])),
      personnel: new FormControl(autorisation != null && autorisation.personnel ? autorisation.personnel.id : "", Validators.compose([Validators.required])),
      typeAutorisation: new FormControl(autorisation != null && autorisation.typeAutorisation ? autorisation.typeAutorisation.id : "", Validators.compose([Validators.required])),
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

  successmsg(title = 'Autorisation ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau autorisation !') {
    Swal.fire(title, message, 'success');
  }

  clear() {
    this.autorisationForm = this.initForm()
  }

  traiteFormAutorisation(){
    if(this.autorisationForm.get('id')?.value == null){
      this.createAutorisation()
    } else{
      this.updateAutorisation()
    }
  }

  createAutorisation() {
    let _data = {
      "dateDebut": this.dateDebut?.value,
      "dateFin": this.dateFin?.value,
      "observation": this.observation?.value,
      "personnel": this.personnel?.value,
      "typeAutorisation": this.typeAutorisation?.value
    }
    this.loading = true
    this._autorisationService.createAutorisation(_data).subscribe(
      (data:any) => {
        this.autorisationForm = this.initForm()
        this.closeModal()
        this.successmsg()
        this.autorisations.push(data)
        this.loading = false
      },
      error => {
        this.loading = false
      }
    )
  }

  initAction(autorisation:Autorisation | null, action:string="delete", content:any) {
    this.openModal(content)
    if (autorisation != null) {
      this.id = autorisation.id
    }
    this.autorisationForm = this.initForm(autorisation!)
  }

  deleteAutorisation() {
    this.loading = true
    this._autorisationService.deleteAutorisation(this.id).subscribe(
      (data:any) => {
        this.autorisationForm = this.initForm()
        this.closeModal()
        this.successmsg("Autorisation supprimer", "Le autorisation a été bien supprimé avec succès")
        this.loading = false
        this.autorisations = this.autorisations.filter(i => i.id !== this.id)
      },
      error => {
        this.loading = false
      }
    )
  }

  updateAutorisation() {
    let _data = {
      "dateDebut": this.dateDebut?.value,
      "dateFin": this.dateFin?.value,
      "observation": this.observation?.value,
      "personnel": this.personnel?.value,
      "typeAutorisation": this.typeAutorisation?.value
    }
    this.loading = true
    this._autorisationService.updateAutorisation(this.id, _data).subscribe(
      (data:any) => {
        this.autorisationForm = this.initForm()
        this.closeModal()
        this.successmsg("Autorisation modifier", "Vous venez modifier le autorisation ")
        this.autorisations = this.autorisations.map(i => i.id !== this.id ? i : data)
        this.loading = false
      },
      error => {
        this.loading = false
      }
    )
  }

  get dateDebut() {
    return this.autorisationForm.get('dateDebut')
  }

  get dateFin() {
    return this.autorisationForm.get('dateFin')
  }

  get observation() {
    return this.autorisationForm.get('observation')
  }

  get personnel() {
    return this.autorisationForm.get('personnel')
  }

  get typeAutorisation() {
    return this.autorisationForm.get('typeAutorisation')
  }

  setDateDirection(date:any) {
    if (date != null) {
      let dates = date.split('-')
      return dates[2]+"-"+dates[1]+"-"+dates[0]
    }
    return date
  }

}

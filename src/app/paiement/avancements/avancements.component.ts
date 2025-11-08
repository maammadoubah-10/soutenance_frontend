import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Personnel } from '../models/personnel';
import { Category } from '../models/category';
import { Echelon } from '../models/echelon';
import { AvancementService } from '../services/avancement.service';
import { PersonnelService } from '../services/personnel.service';
import { CategorieService } from '../services/categorie.service';
import { EchelonService } from '../services/echelon.service';
import { Avancement } from '../models/avancement';

@Component({
  selector: 'app-avancements',
  templateUrl: './avancements.component.html',
  styleUrls: ['./avancements.component.scss']
})
export class AvancementsComponent implements OnInit {
   
  public avancements: any = [];
  public personnels:Personnel[] = [];
  public categories:Category[] = [];
  public echelons: Echelon[] = []
  public avancementForm!: FormGroup;
  public perPage:number = 10;
  public p: number = 1;
  public loading:boolean = false;
  public id?:number;
  items: any[] = [];
  constructor(private router:Router, 
    private _avancementService:AvancementService,
    private _personnelService:PersonnelService,
    private _categorieService:CategorieService, 
    private modalService: NgbModal, 
    private _echelonService:EchelonService) {
  }

  ngOnInit(): void {
    this.chargerAvancements();
    this.items = [
      { label: 'Paiement' },
      { label: 'Avancements', active: true },
    ];

    this.avancementForm = this.initForm()

     this._personnelService.getPersonnels().subscribe((response: any) => {
    this.personnels = response.content; // Extraire le tableau des banques
  },(error)=>{
        console.log(error);
      },()=>{
        console.log("Terminé");
      }
    )

    this._categorieService.getCategories().subscribe(
      (data:any) => {
        this.categories = data.content;
        console.log(data);
      },
      (error)=>{
        console.log(error);
      },
      ()=>{
        console.log('Termnier');
      }
    )

    this._echelonService.getEchelons().subscribe(
      (data:any)=>{
          this.echelons = data.content;
      },
      (error)=>{
        console.log(error);
      },
      ()=>{
        console.log('Termnier');
      }
    )
  }

  chargerAvancements(){
    this._avancementService.getAvancements(this.p - 1,this.perPage).subscribe(
      (data:any) =>{
        this.avancements = data.content;
        this.avancements = data.content || [];
        console.log(data)
      },
      (error)=>{
        console.log(error);
      },
      ()=>{
        console.log('Termnier');
      }
    )
  }

  onPageChange(event:any): void {
    this.p = event
    this.chargerAvancements();
  }

  perPageChange(){
    console.log(this.perPage);
    this.chargerAvancements();
  }


  initForm(avancement?:Avancement):FormGroup {
    return new FormGroup({
      dateChangementCategorie: new FormControl(avancement != null ? this.setDateDirection(avancement.dateChangementCategorie) : "", Validators.compose([Validators.required])),
      personnel: new FormControl(avancement != null && avancement.personnel ? avancement.personnel.id : "", Validators.compose([Validators.required])),
      categorie: new FormControl(avancement != null && avancement.categorie ? avancement.categorie.id : "", Validators.compose([Validators.required])),
      echelon: new FormControl(avancement != null && avancement.echelon ? avancement.echelon.id : "", Validators.compose([Validators.required])),
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

  successmsg(title = 'Avancement ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau avancement !') {
    Swal.fire(title, message, 'success');
  }

  clear() {
    this.avancementForm = this.initForm()
  }

  traiteFormAvancement(){
    if(this.id == null){
      this.createAvancement()
    } else{
      this.updateAvancement()
    }
  }

  createAvancement() {
    let _data = {
      "dateChangementCategorie": this.dateChangementCategorie?.value,
      "personnel": this.personnel?.value,
      "categorie": this.categorie?.value,
      "echelon": this.echelon?.value
    }
    this.loading = true
    this._avancementService.createAvancement(_data).subscribe(
      (data:any) => {
        this.avancementForm = this.initForm()
        this.closeModal()
        this.successmsg()
        this.avancements.unshift(data)
        this.loading = false
      },
      error => {
        console.log(error);
      },()=>{
        this.loading = false
      }
    )
  }

  initAction(avancement:Avancement | null, action:string="delete", content:any) {
    this.openModal(content)
    if (avancement != null) {
      this.id = avancement.id
    }
    this.avancementForm = this.initForm(avancement!)
  }

  deleteAvancement() {
    this.loading = true
    this._avancementService.deleteAvancement(this.id!).subscribe(
      (data:any) => {
        this.avancementForm = this.initForm()
        this.closeModal()
        this.successmsg("Avancement supprimer", "Le avancement a été bien supprimé avec succès")
        this.loading = false
        this.avancements = this.avancements.filter((i:any) => i.id !== this.id)
      },
      error => {
        this.loading = false
      }
    )
  }

  updateAvancement() {
    let _data = {
      "dateChangementCategorie": this.dateChangementCategorie?.value,
      "personnel": this.personnel?.value,
      "categorie": this.categorie?.value,
      "echelon": this.echelon?.value
    }
    this.loading = true
    this._avancementService.updateAvancement(this.id!, _data).subscribe(
      (data:any) => {
        this.avancementForm = this.initForm()
        this.closeModal()
        this.successmsg("Avancement modifier", "Vous venez modifier le avancement ")
        this.avancements = this.avancements.map((i: { id: number; }) => i.id !== this.id ? i : data)
        this.loading = false
      },
      error => {
        this.loading = false
      }
    )
  }

  get dateChangementCategorie() {
    return this.avancementForm.get('dateChangementCategorie')
  }

  get personnel() {
    return this.avancementForm.get('personnel')
  }

  get categorie() {
    return this.avancementForm.get('categorie')
  }

  get echelon(){
    return this.avancementForm.get('echelon')
  }

  setDateDirection(date:any) {
    if (date != null) {
      let dates = date.split('-')
      return dates[2]+"-"+dates[1]+"-"+dates[0]
    }
    return date
  }

}

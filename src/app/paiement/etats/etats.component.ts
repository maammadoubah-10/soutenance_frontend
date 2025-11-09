import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';
import * as html2pdf from "html2pdf.js"
import { TypeEtat } from '../models/type-etat';
import { Etat } from '../models/etat';
import { Entite } from '../models/entite';
import { EtatService } from '../services/etat.service';
import { BulletinSalaireService } from '../services/bulletin-salaire.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-etats',
  templateUrl: './etats.component.html',
  styleUrls: ['./etats.component.scss']
})
export class EtatsComponent implements OnInit {
  items: any[] = [];
  public etats:Etat[] = [];
  public entites:Entite[] = [];
  public typeEtats:TypeEtat[] = [];
  public etatForm!: FormGroup;
  public bulletinsSalaire = []
  public perPage:number = 10;
  public p: number = 1;
  public loading:boolean = false;
  public id:number = 0;

  constructor(private router:Router, private  _etatService:EtatService, private modalService: NgbModal, private _bulletinSalaireService: BulletinSalaireService) {

  }

  ngOnInit(): void {
    this.etatForm = this.initForm()

  this.items = [
      { label: 'Paiement' },
      { label: 'Etats', active: true },
    ];
  

    this._bulletinSalaireService.getBulletinSalaires().subscribe(
      (data:any)=>{
        this.bulletinsSalaire = data.content
        this.bulletinsSalaire = data.content || [];
      }, (error)=>{
        console.log(error);
      }, ()=>{
        console.log("Terminer");
        
      }
    )
    
    // this._etatService.getEtats().subscribe(data => this.etats = data)
    // this._entiteService.getEntites().subscribe(data => this.entites = data)
    // this._typeEtatService.getTypeEtats().subscribe(data => this.typeEtats = data)
  }

  initForm(etat?:Etat):FormGroup {
    return new FormGroup({
      dateDebut: new FormControl(etat != null ? this.setDateDirection(etat.dateDebut) : "", Validators.compose([Validators.required])),
      dateFin: new FormControl(etat != null ? this.setDateDirection(etat.dateFin) : "", Validators.compose([Validators.required])),
      entite: new FormControl(etat != null && etat.entite ? etat.entite.id : "", Validators.compose([Validators.required])),
      typeEtat: new FormControl(etat != null && etat.typeEtat ? etat.typeEtat.id : "", Validators.compose([Validators.required])),
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

  successmsg(title = 'Etat ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau etat !') {
    Swal.fire(title, message, 'success');
  }

  clear() {
    this.etatForm = this.initForm()
  }

  createEtat() {
    let _data = {
      "dateDebut": this.dateDebut?.value,
      "dateFin": this.dateFin?.value,
      "entite": this.entite?.value,
      "typeEtat": this.typeEtat?.value,
    }
    this.loading = true
    this._etatService.createEtat(_data).subscribe(
      data => {
        this.etatForm = this.initForm()
        this.closeModal()
        this.successmsg()
        this.etats.push(data)
        this.loading = false
      },
      error => {
        this.loading = false
      }
    )
  }

  initAction(etat:Etat, action:string="delete", content:any) {
    this.openModal(content)
    if (etat != null) {
      this.id = etat.id
    }
    this.etatForm = this.initForm(etat)
  }

  deleteEtat() {
    this.loading = true
    this._etatService.deleteEtat(this.id).subscribe(
      data => {
        this.etatForm = this.initForm()
        this.closeModal()
        this.successmsg("Etat supprimer", "Le etat a été bien supprimé avec succès")
        this.loading = false
        this.etats = this.etats.filter(i => i.id !== this.id)
      },
      error => {
        this.loading = false
      }
    )
  }

  updateEtat() {
    let _data = {
      "dateDebut": this.dateDebut?.value,
      "dateFin": this.dateFin?.value,
      "entite": this.entite?.value,
      "typeEtat": this.typeEtat?.value,
    }
    this.loading = true
    this._etatService.updateEtat(this.id, _data).subscribe(
      data => {
        this.etatForm = this.initForm()
        this.closeModal()
        this.successmsg("Etat modifier", "Vous venez modifier le etat ")
        this.etats = this.etats.map(i => i.id !== this.id ? i : data)
        this.loading = false
      },
      error => {
        this.loading = false
      }
    )
  }

  get dateDebut() {
    return this.etatForm.get('dateDebut')
  }

  get dateFin() {
    return this.etatForm.get('dateFin')
  }

  get entite() {
    return this.etatForm.get('entite')
  }

  get typeEtat() {
    return this.etatForm.get('typeEtat')
  }

  setDateDirection(date:any) {
    if (date != null) {
      let dates = date.split('-')
      return dates[0]+"-"+dates[1]+"-"+dates[2]
    }
    return date
  }

  show(etat:Etat) {
    this.router.navigate(['/paie/etat/'+etat.id])
  }

  @ViewChild('pdfTable') pdfTable?: ElementRef;

  public downloadAsPDF() {
    const doc = new jsPDF();

    const pdfTable = this.pdfTable?.nativeElement;

    var html = htmlToPdfmake(pdfTable.innerHTML);

    const documentDefinition = { content: [html], styles:{
        red :{
          color:'red !important'
        }
      }
    };
    pdfMake.createPdf(documentDefinition).open();

  }

  downloadAsPDF1() {
    var element = document.getElementById('pdfTable');
    var opt = {
      margin: [20, 10], // reduce top and bottom margins
      filename: `Fiche de salaire.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 192,
        scale: 1, // set scale to 1 to fit entire content
        letterRendering: true,
        useCORS: true
      },
      jsPDF: {
        unit: 'mm', // set unit to millimeter
        format: [594, 420], // set page size to A4 landscape
        orientation: 'landscape' // set orientation to landscape
      }
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(element).save();
  }

}

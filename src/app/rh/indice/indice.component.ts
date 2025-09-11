import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, map, startWith} from "rxjs/operators";
import Swal from "sweetalert2";
import {ToastrService} from "ngx-toastr";
import { DataStateEnum, ModelDataState } from '../../state/state';
import { Indice } from '../models/indice';
import { IndiceService } from '../services/indice.service';

@Component({
  selector: 'app-indice',
  templateUrl: './indice.component.html',
  styleUrls: ['./indice.component.scss']
})
export class IndiceComponent implements OnInit {

  items: any[]= [];
  dataStateEnum = DataStateEnum
  state?: DataStateEnum
  dossiers?: Observable<ModelDataState<Indice[]>>
  listeDossierPage: Indice[] = []
  public nom:string = '';
  public searchValue: string = '';
  public loading:boolean=false;
  public id?:number;

  formulaireDossier = new FormGroup({
    id: new  FormControl(),
    nom: new FormControl('', [Validators.required]),
  })
  totalDossier : number = 0;
  currentPage: number = 0;
  dossierPerPage: number = 10;
  sort: string = "desc";
  public pages: number[] = [];
  totalPages: number = 0;
  devisSbj = new BehaviorSubject(0); // remove tab
  constructor(private dossierService: IndiceService,
              private toastService:ToastrService,
              private modalService:NgbModal) { } //générer les messages
  ngOnInit(): void {
    this.items = [
      {label: 'Ressources Humaines'},
      {label: 'Indices', active: true}
    ];
    this.chargerListeIndicePage();
  }


  chargerListeIndicePage(): void {
    this.dossiers = this.dossierService
      .listerIndicePage(this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeDossierPage = response.body.content;
          this.totalDossier = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return {
            dataState: this.dataStateEnum.CHARGE,
            data: this.listeDossierPage,
          };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      )
      .pipe(
        catchError((err) => {
          return of({ dataState: this.dataStateEnum.ERREUR, data: [] });
        })
      );
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }


  openModal(content:any, dossier:Indice | undefined = undefined){
    if (dossier){
      this.formulaireDossier.patchValue(dossier as any)
    }else{
      this.formulaireDossier.reset()
    }
    this.modalService.open(content)

  }


  creeModifierIndice(){
    if(this.formulaireDossier.valid)
      if(this.formulaireDossier.get('id')?.value){
        this.dossierService.modifierIndice(this.formulaireDossier.get("id")?.value, this.formulaireDossier.value)
          .subscribe(
            (response:any)=>{
              this.listeDossierPage.map(e =>{
                if (e.id == response.id){
                  e.nom = response.nom
                }
                return e;
              })
              this.modalService.dismissAll()
              this.chargerListeIndicePage()
              this.successmsg("Indice modifier", "L'indice a été modifié avec succès")
              this.formulaireDossier.reset()
            },
            (error)=> {
              const errors = error.error.errors;
              for (let i = 0; i < errors.length; i++) {
                const currentError = errors[i];
                this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
              }
            }
          )
      }else{
        this.dossierService.creerIndice(this.formulaireDossier.value).subscribe(
          (response:any)=>{
            this.listeDossierPage.unshift(response['data'])
            this.formulaireDossier.reset()
            this.modalService.dismissAll()
            this.chargerListeIndicePage()
            this.successmsg()
          },
          (error)=> {
              const errors = error.error.errors;
              for (let i = 0; i < errors.length; i++) {
                const currentError = errors[i];
                this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
              }
          }
        )
      }
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  successmsg(title = 'Indice ajouter !', message = 'Vous venez d\'ajoutez avec succès une nouvelle Indice !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message:string) {
    Swal.fire(title, message, 'error');
  }

  supprimerDossier(id: number) {
    Swal.fire({
      title: 'Êtes vous sûr ?',
      text: 'Êtes vous sûr de vouloir le supprimer. Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Supprimez le!',
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.value) {
        this.dossierService.supprimerIndice(id).subscribe({
          next: (value:any) => {
            this.devisSbj.next(0);
            this.listeDossierPage = this.listeDossierPage.filter(
              (i) => i.id !== id
            );
            this.successmsg('Suppression réussie', 'Indice supprimer');
          },
          error: (err) => {
            this.errormsg('Indice non supprimer', err.error.message);
          },
        });
      }
    });
  }

}

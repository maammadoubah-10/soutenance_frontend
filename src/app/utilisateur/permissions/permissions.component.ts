import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../services/utilisateur.service';
import { Permission, PermissionDto } from '../models/permission';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';

import { DataStateEnum, ModelDataState, TypeErreur } from '../../state/state';
import { map, catchError, startWith, tap } from 'rxjs/operators';
import Swal from "sweetalert2";
import {ToastrService} from "ngx-toastr";
import { AuthentificationService } from '../../authentification/services/authentication.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})


export class PermissionsComponent implements OnInit {
  //
 items: any[] = [];

  term: any;
  //
  permissin$:any;
  //currentpage: number;

  formData?: FormGroup;
  pattern = "^[^ \n]*$";
  permissions: Permission[]=[]
  permissionsStates$?: Observable<ModelDataState<Permission[]>>;
  message$?: Observable<any>;
  dataStateEnum = DataStateEnum;
  typeErreur = TypeErreur;

  modification = false;

  id: number= 0;
  index?: number;
  code?: string;
  totalPermissions: number = 0;
  currentPage: number = 0;
  permissionsPerPage: number = 10;
  public pages: number[] = [];
  totalPages !: number;
  devisSbj = new BehaviorSubject(0);
  formulairePermission = new FormGroup({
    id: new FormControl<number | null>(null),
    code: new FormControl('',[Validators.required, Validators.pattern(this.pattern)]),
    description: new FormControl('', [Validators.required]),
  })

  constructor(private utilisateurService: UtilisateurService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private toastService: ToastrService,
              private authentificationService: AuthentificationService) { }

  ngOnInit(): void {
    this.items = [
      { label: 'Utilisateurs' },
      { label: 'Permissions', active: true }
    ];

    this.onAfficherLesPermissions();

  }


  handleClick() {
    if (!this.code) {
      this.onAfficherLesPermissions();
    }else {
      this.search()
    }
  }

  search(): void {
    this.permissionsStates$ =  this.utilisateurService.afficherLesPermissionsPageRecherches(this.currentPage, this.permissionsPerPage, this.code)
      .pipe(
        map((res: any) => {
          this.permissions = res.body.content;
          if (this.permissions.length === 0) {
            this.errormsg('Erreur', 'Aucun enregistrement ne correspond à votre recherche');
            this.onAfficherLesPermissions()
          }
          this.totalPermissions = res.body.totalElements;
          this.totalPages = res.body.totalPages;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.permissions };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      ).pipe(
        catchError(err => {
          return of({ dataState: this.dataStateEnum.ERREUR, data: [] });
        })
      );
  }

  onAfficherLesPermissions(): void {
    this.permissionsStates$ = this.utilisateurService
      .afficherLesPermissionsPageRecherches(this.currentPage, this.permissionsPerPage)
      .pipe(
        map((data: any) => {
          this.permissions = data.body.content;
          this.totalPermissions = data.body.totalElements;
          this.totalPages = data.body.totalPages
          this.pages = this.getPages();
          return {
            dataState: this.dataStateEnum.CHARGE,
            data: this.permissions,
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

  onPageChange(event: any): void {
    this.currentPage = 0;
    this.permissionsPerPage = 10;
    if (this.code && this.code.length >= 3) {
      this.search();
      if (this.permissions.length === 0) {
        throw new Error('Aucun résultat trouvé pour la recherche.');
        this.errormsg('Erreur', 'Aucun résultat ne correspond à votre recherche');
        this.toastService.error('Aucun résultat ne correspond à votre recherche', 'Erreur');      }
    } else if (!this.code?.length) {
      this.onAfficherLesPermissions();
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }


  closeModal() {
    this.modalService.dismissAll();
  }

  successmsg(
    title = 'Permission ajouter !',
    message = "Vous venez d'ajoutez avec succès une nouvelle Permission !"
  ) {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message:any) {
    Swal.fire(title, message, 'error');
  }


  openModal(content:any, permission:Permission | undefined = undefined){
    if (permission){
      this.formulairePermission.patchValue(permission as any)
    }else{
      this.formulairePermission.reset()
    }
    this.modalService.open(content)

  }


  creerModifierPermission(){
    if(this.formulairePermission.valid)
      if(this.formulairePermission.get('id')?.value){
        this.utilisateurService.modifierPermission(this.formulairePermission.value)
          .subscribe(
            (response)=>{
              this.permissions.map(e =>{
                if (e.id == response.body.id){
                  e.code = response.body.code
                  e.description = response.body.description
                }
                return e;
              })
              this.modalService.dismissAll()
              this.successmsg("Permission modifier", "Le Permission a été modifié avec succès")
              this.formulairePermission.reset()
            },
            (error)=> {
              this.toastService.error(error.error.message, 'Erreur');
              for (let erreur in error.error.errors) {
                this.toastService.error(erreur + " " + error.error.errors[erreur], 'Erreur');
              }
            }
          )
      }else{
        this.utilisateurService.creerPermission(this.formulairePermission.value).subscribe(
          (response)=>{
            this.permissions.unshift(response['data'])
            this.formulairePermission.reset()
            this.modalService.dismissAll()
            this.onAfficherLesPermissions()
            this.successmsg()
          },
          (error)=> {
            this.toastService.error(error.error.message, 'Erreur');
            for (let erreur in error.error.errors) {
              this.toastService.error(erreur + " " + error.error.errors[erreur], 'Erreur');
            }
          }
        )
      }
  }

  supprimerFormat(id: number) {
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
        this.utilisateurService.supprimerPermission(id).subscribe({
          next: (value) => {
            this.devisSbj.next(0);
            this.permissions = this.permissions.filter(
              (i) => i.id !== id
            );
            this.toastService.success('Suppression réussie', 'Permission supprimer');
            this.successmsg( 'Permission supprimer','Suppression réussie');
          },
          error: (err) => {
            this.toastService.error(err.error.message, 'Permission non supprimer');
            this.errormsg('Permission non supprimer', err.error.message);
          },
        });
      }
    });
  }

}

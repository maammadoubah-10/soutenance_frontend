import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { Utilisateur, UtilisateurDto } from '../models/utilisateur';
import { UtilisateurService } from '../services/utilisateur.service';
import { map, catchError, startWith, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from '../models/role';
import { waitForAsync } from '@angular/core/testing';
import Swal from 'sweetalert2';
import {ToastrService} from "ngx-toastr";
import { DataStateEnum, ModelDataState, TypeErreur } from '../../state/state';
import { AuthentificationService } from '../../authentification/services/authentication.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommunModule } from "../../commun/commun.module";

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss'],
  // imports: [CommunModule],
  // imports: [BrowserAnimationsModule]
})
export class UtilisateursComponent implements OnInit {
 items: any[] = [];
  term: any;
  listeRole: Role[] = []

  utilisateur$:any;
  utilisateurs$:any;

  //currentpage: number;
  personnels : any []=[];
  roles : Role []=[];
   listeId = []=[];
  rolesDuPersonnel?: Role[];
  formData?: FormGroup;
  utilisateurs: Utilisateur[]=[];
  listeUtilisateur: Utilisateur[] = []
  utilisateursStates$?: Observable<ModelDataState<Utilisateur[]>>;
  message$?: Observable<any>;
  dataStateEnum = DataStateEnum;
  typeErreur = TypeErreur;

  modification = false;

  id?: number;
  index?: number;
  idUtilisateur: number=0;
  utilisateur? : Utilisateur
  roleIds: number[]=[];
  designation?: string;
  nom?: string;
  totalUtilisateurs: number = 0;
  currentPage: number = 0;
  utilisateurPerPage: number = 10;
  public pages: number[] = [];
  public searchItemRole: string = ""
  public searchItemPersonnel: string = ""
  public loading: boolean = false;
  totalPages: number= 0;
  devisSbj = new BehaviorSubject(0);
  formulaireUtilisateur = new FormGroup({
    id: new  FormControl(),
    email: new FormControl('', [Validators.required,Validators.email]),
    role: new FormControl('', [Validators.required]),
    personnelid: new FormControl('', [Validators.required]),

  })



  constructor(private utilisateurService: UtilisateurService,
              private modalService: NgbModal,
              private toastService: ToastrService,
              private formBuilder: FormBuilder,
              private authentificationService: AuthentificationService) { }


  ngOnInit(): void {

    this.items = [{ label: 'Utilisateurs' },
      { label: 'Les utilisateurs', active: true }];


    this.formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      personnelid: ['', [Validators.required]],
    });

    this.onAfficherLesUtilisateurs();

    this.utilisateurService.personnelNonUtilisateur().subscribe(x => {
      this.personnels = x;
    });

    this.utilisateurService.afficherLesRoles().subscribe(x => {
      this.roles = x;
    });

  }

  handleClick() {
    if (!this.designation) {
      this.onAfficherLesUtilisateurs();
    }else {
      this.search()
    }
  }

  search(): void {
    this.utilisateursStates$ =  this.utilisateurService.afficherLesUtilisateursPageRecherches()
      .pipe(
        map((res: any) => {
          this.utilisateurs = res.body.content;
          if (this.utilisateurs?.length === 0) {
            this.errormsg('Erreur', 'Aucun enregistrement ne correspond à votre recherche');
            this.onAfficherLesUtilisateurs()
          }
          this.totalUtilisateurs = res.body.totalElements;
          this.totalPages = res.body.totalPages;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.utilisateurs };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      ).pipe(
        catchError(err => {
          return of({ dataState: this.dataStateEnum.ERREUR, data: [] });
        })
      );
  }

  onAfficherLesUtilisateurs(): void {
  this.utilisateursStates$ = this.utilisateurService
    .afficherLesUtilisateursPageRecherches()
    .pipe(
      map((res: any) => {
        const body = res?.body ?? res;
        const content = body?.content ?? body;
        this.totalUtilisateurs = body?.totalElements ?? (Array.isArray(content) ? content.length : 0);
        this.totalPages = body?.totalPages ?? 1;
        this.pages = this.getPages();
        return { dataState: this.dataStateEnum.CHARGE, data: Array.isArray(content) ? content : [] };
      }),
      startWith({ dataState: this.dataStateEnum.CHARGEMENT, data: [] }),
      catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] }))
    );
}

  onPageChange(event: any): void {
    this.currentPage = 0;
    this.utilisateurPerPage = 10;
    if (this.designation && this.designation.length >= 3) {
      this.search();
      if (this.utilisateurs?.length === 0) {
        throw new Error('Aucun résultat trouvé pour la recherche.');
        this.errormsg('Erreur', 'Aucun résultat ne correspond à votre recherche');
        this.toastService.error('Aucun résultat ne correspond à votre recherche', 'Erreur');      }
    } else if (!this.designation?.length) {
      this.onAfficherLesUtilisateurs();
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  onSearchRole(searchItemRole : string){
    if(searchItemRole.length >= 3){
      this.utilisateurService.rechercheRole(searchItemRole).subscribe(
        (response : any) => {
          this.roles = response
        },(error)=>{
        }
      );
    }
  }

  onSearchPersonnel(searchItemPersonnel : string){
    if(searchItemPersonnel.length >= 3){
      this.utilisateurService.recherchePersonnel(searchItemPersonnel).subscribe(
        (response : any) => {
          this.personnels = response
        },(error)=>{
        }
      );
    }
  }


  openModal(content:any, utilisateur:Utilisateur | undefined = undefined){
    if (utilisateur){
      this.formulaireUtilisateur.patchValue(utilisateur as any)
    }else{
      this.formulaireUtilisateur.reset()
    }
    this.modalService.open(content)

  }

  creerModifierUtilisateur(){
    if(this.formulaireUtilisateur.valid)
      if(this.formulaireUtilisateur.get('id')?.value){
        this.utilisateurService.modifierUtilisateur(this.formulaireUtilisateur.value)
          .subscribe(
            (response)=>{
              this.utilisateurs?.map(e =>{
                if (e.id == response.body.id){
                  e.email = response.body.email
                  e.roles = response.body.role
                  e.personnelid = response.body.personnelid
                }
                return e;
              })
              this.modalService.dismissAll()
              this.successmsg("Utlisateur modifier", "L'utlisateur a été modifié avec succès")
              this.formulaireUtilisateur.reset()
            },
            (error)=> {
              this.toastService.error(error.error.message, 'Erreur');
              for (let erreur in error.error.errors) {
                this.toastService.error(erreur + " " + error.error.errors[erreur], 'Erreur');
              }
            }
          )
      }else{
        this.utilisateurService.creerUtilisateur(this.formulaireUtilisateur.value).subscribe(
          (response)=>{
            this.utilisateurs?.unshift(response['data'])
            this.formulaireUtilisateur.reset()
            this.modalService.dismissAll()
            this.onAfficherLesUtilisateurs()
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
        this.utilisateurService.supprimerUtilisateur(id).subscribe({
          next: (value) => {
            this.devisSbj.next(0);
            this.utilisateurs = this.utilisateurs?.filter(
              (i) => i.id !== id
            );
            this.toastService.success('Suppression réussie', 'Utlisateur supprimer');
            this.successmsg( 'Utlisateur supprimer','Suppression réussie');
          },
          error: (err) => {
            this.toastService.error(err.error.message, 'Utlisateur non supprimer');
            this.errormsg('Utlisateur non supprimer', err.error.message);
          },
        });
      }
    });
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  successmsg(title = 'Utilisateur ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau utilisateur !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message:any) {
    Swal.fire(title, message, 'error');
  }

  openModalDetails(content: any, role? : Role[]) {
    this.modalService.open(content);
    this.listeRole = []
    if(role){
      this.listeRole = role
    }
  }


  openModalRetirerRolesUtilisateur(utilisateur: Utilisateur, content:any) {
    this.openModal(content);
    this.idUtilisateur = utilisateur.id;
    this.rolesDuPersonnel = utilisateur.roles
  }

  retirerUnRole() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir retirer le/les rôle(s). Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Retirer le/les !',
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.retirerRole();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // handle cancel action if necessary
      }
    }).catch((errors) => {
      this.toastService.error(errors.message, 'Rôle non retirer');
      this.errormsg('Rôle non retirer', errors.message);
    });
  }

  retirerRole(): void {
    this.utilisateurService.retirerUnRole(this.idUtilisateur, this.roleIds)
      .subscribe((utilisateur: Utilisateur) => {
        this.utilisateur = utilisateur;
        this.roleIds = []; // Réinitialise les roles sélectionnées à une valeur vide
        this.modalService.dismissAll()
        this.onAfficherLesUtilisateurs()
        this.successmsg('Rôle(s) Retirer', 'Le/Les rôle(s) a/ont été retirée avec succes')
      }, (error) => {
        // Handle error (e.g., show an error message)
        console.error(error);
      });
  }

  openModalAjouterRolesUtilisateur(utilisateur: Utilisateur, content:any) {
    this.openModal(content);
    this.idUtilisateur = utilisateur.id;
  }

  ajouterUnRole() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir ajouter le/les rôle(s). Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Ajouter le/les !',
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ajouterRole();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // handle cancel action if necessary
      }
    }).catch((errors) => {
      this.toastService.error(errors.message, 'Permission non ajouter');
      this.errormsg('Permission non ajouter', errors.message);
    });
  }

  ajouterRole(): void {
    this.utilisateurService.ajouterUnRole(this.idUtilisateur, this.roleIds)
      .subscribe((utilisateur: Utilisateur) => {
        this.utilisateur = utilisateur;
        this.roleIds = []; // Réinitialise les rôles sélectionnées à une valeur vide
        this.modalService.dismissAll()
        this.onAfficherLesUtilisateurs()
        this.successmsg('Rôle(s) Ajouter', 'Le/Les rôle(s) a/ont été ajoutée avec succes')
      }, (error) => {
        // Handle error (e.g., show an error message)
        console.error(error);
      });
  }


  inverserEstActif( utilisateur: Utilisateur) {
    const isSpecialCase = utilisateur.est_actif == false; // Replace this with your condition
    const confirmButtonLabel = isSpecialCase ? 'Oui, Activer le !' : 'Oui, Désactiver le !';
    const textMessage = isSpecialCase ? 'Êtes-vous sûr de vouloir Activer cet utilisateur. Il vous sera impossible de revenir en arrière !'
      : 'Êtes-vous sûr de vouloir Désactiver cet utilisateur. Il vous sera impossible de revenir en arrière !';

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: textMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: confirmButtonLabel,
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.inverserEtatActifUtilisateur(utilisateur.id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // handle cancel action if necessary
      }
    }).catch((errors) => {
      this.toastService.error(errors.message, 'Utilisateur non retirer');
      this.errormsg('Utilisateur non retirer', errors.message);
    });
  }

  inverserEtatActifUtilisateur(utilisateurId: number): void {
    this.utilisateurService
      .inverserEtatEstActifUtilisateur(utilisateurId)
      .subscribe((utilisateur) => {
        this.utilisateur = utilisateur;
        this.onAfficherLesUtilisateurs()
        if(utilisateur.est_actif){
          this.successmsg( 'Utlisateur activer','L\'utilisateur a été avtivé avec succes');
        } else {
          this.successmsg( 'Utlisateur désactiver','L\'utilisateur a été désactivé avec succes');
        }
      });
  }


  inverserEstAdmin( utilisateur: Utilisateur) {
    const isSpecialCase = utilisateur.estAdmin == false; // Replace this with your condition
    const confirmButtonLabel = isSpecialCase ? 'Oui, Nommer le !' : 'Oui, Révoquer le !';
    const textMessage = isSpecialCase ? 'Êtes-vous sûr de vouloir Nommer cet utilisateur Admin. Il vous sera impossible de revenir en arrière !'
      : 'Êtes-vous sûr de vouloir Révoquer cet utilisateur. Il vous sera impossible de revenir en arrière !';

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: textMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: confirmButtonLabel,
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.inverserEtatAdminUtilisateur(utilisateur.id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // handle cancel action if necessary
      }
    }).catch((errors) => {
      this.toastService.error(errors.message, 'Utilisateur non retirer');
      this.errormsg('Utilisateur non retirer', errors.message);
    });
  }

  inverserEtatAdminUtilisateur(utilisateurId: number): void {
    this.utilisateurService
      .inverserEtatEstAdminUtilisateur(utilisateurId)
      .subscribe((utilisateur) => {
        this.utilisateur = utilisateur;
        this.onAfficherLesUtilisateurs()
        if(utilisateur.est_actif){
          this.successmsg( 'Utlisateur nommer','L\'utilisateur a été nommé admin avec succes');
        } else {
          this.successmsg( 'Utlisateur révoquer','L\'utilisateur a été révoquer avec succes');
        }
      });
  }


}

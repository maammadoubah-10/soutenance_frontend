import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Role, RoleDto } from '../models/role';
import { UtilisateurService } from '../services/utilisateur.service';
import { map, catchError, startWith, tap } from 'rxjs/operators';
import { Permission } from '../models/permission';
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { DataStateEnum, ModelDataState, TypeErreur } from '../../state/state';
import { AuthentificationService } from '../../authentification/services/authentication.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  items ?: Array<{}>;
  term: any;

  roles$: any;
  //currentpage: number;
  permissionsListe: Permission[] = [];
  permissions: Permission[] = [];
  permissionsDuRoles: Permission[] = [];
  formData?: FormGroup;
  pattern = "^[^ \n]*$";
  roles: Role[] = [];
  idRole: number = 0
  permissionIds: number[] = [];

  role?: Role
  rolesStates$?: Observable<ModelDataState<Role[]>>;
  message$?: Observable<any>;
  dataStateEnum = DataStateEnum;
  typeErreur = TypeErreur;
  modification = false;

  id?: number;
  index?: number;
  selected?: number;
  nom: string = "";
  totalRoles: number = 0;
  currentPage: number = 0;
  rolesPerPage: number = 10;
  public pages: number[] = [];
  public searchItemPermission: string = ""
  public loading: boolean = false;
  totalPages: number = 0;
  devisSbj = new BehaviorSubject(0);
  formulaireRole = new FormGroup({
   id: new FormControl<number | null>(null),
    nom: new FormControl('', [Validators.required]),
    permissions: new FormControl('', [Validators.required]),
  })


  constructor(private utilisateurService: UtilisateurService,
    private modalService: NgbModal,
    private toastService: ToastrService,
    private formBuilder: FormBuilder,
    private authentificationService?: AuthentificationService) {

  }

  ngOnInit(): void {
    this.items = [{ label: 'Utilisateurs' },
    { label: 'Roles', active: true }];

    this.onAfficherLesRoles();

    this.utilisateurService.afficherLesPermissions().subscribe(x => {
      this.permissions = x;
    });

  }

  handleClick() {
    if (!this.nom) {
      this.onAfficherLesRoles();
    } else {
      this.search()
    }
  }

  search(): void {
    this.rolesStates$ = this.utilisateurService.afficherLesRolePageRecherches(this.currentPage, this.rolesPerPage, this.nom)
      .pipe(
        map((res: any) => {
          this.roles = res.body.content;
          if (this.roles.length === 0) {
            this.errormsg('Erreur', 'Aucun enregistrement ne correspond à votre recherche');
            this.onAfficherLesRoles()
          }
          this.totalRoles = res.body.totalElements;
          this.totalPages = res.body.totalPages;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.roles };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      ).pipe(
        catchError(err => {
          return of({ dataState: this.dataStateEnum.ERREUR, data: [] });
        })
      );
  }

  onAfficherLesRoles(): void {
    this.rolesStates$ = this.utilisateurService
      .afficherLesRolePageRecherches(this.currentPage, this.rolesPerPage)
      .pipe(
        map((data: any) => {
          this.roles = data.body.content;
          this.totalRoles = data.body.totalElements;
          this.totalPages = data.body.totalPages
          this.pages = this.getPages();
          return {
            dataState: this.dataStateEnum.CHARGE,
            data: this.roles,
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
    this.rolesPerPage = 10;
    if (this.nom && this.nom.length >= 3) {
      this.search();
      if (this.roles.length === 0) {
        throw new Error('Aucun résultat trouvé pour la recherche.');
        this.errormsg('Erreur', 'Aucun résultat ne correspond à votre recherche');
        this.toastService.error('Aucun résultat ne correspond à votre recherche', 'Erreur');
      }
    } else if (!this.nom?.length) {
      this.onAfficherLesRoles();
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
    title = 'Role ajouter !',
    message = "Vous venez d'ajoutez avec succès un nouveau Role !"
  ) {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message: any) {
    Swal.fire(title, message, 'error');
  }


  openModal(content: any, role: Role | undefined = undefined) {
    if (role) {
      this.formulaireRole.patchValue(role as any)
    } else {
      this.formulaireRole.reset()
    }
    this.modalService.open(content)

  }

  creerModifierRole() {
    if (this.formulaireRole.valid)
      if (this.formulaireRole.get('id')?.value) {
        this.utilisateurService.modifierRole(this.formulaireRole.value)
          .subscribe(
            (response) => {
              this.roles.map(e => {
                if (e.id == response.body.id) {
                  e.nom = response.body.nom
                  e.permissions = response.body.permissions
                }
                return e;
              })
              this.modalService.dismissAll()
              this.successmsg("Role modifier", "Le Rôle a été modifié avec succès")
              this.formulaireRole.reset()
            },
            (error) => {
              this.toastService.error(error.error.message, 'Erreur');
              for (let erreur in error.error.errors) {
                this.toastService.error(erreur + " " + error.error.errors[erreur], 'Erreur');
              }
            }
          )
      } else {
        this.utilisateurService.creerRole(this.formulaireRole.value).subscribe(
          (response) => {
            this.roles.unshift(response['data'])
            this.formulaireRole.reset()
            this.modalService.dismissAll()
            this.onAfficherLesRoles()
            this.successmsg()
          },
          (error) => {
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
      cancelButtonText: 'Non, Annuler',
    }).then((result) => {
      if (result.value) {
        this.utilisateurService.supprimerRole(id).subscribe({
          next: (value) => {
            this.devisSbj.next(0);
            this.roles = this.roles.filter(
              (i) => i.id !== id
            );
            this.toastService.success('Suppression réussie', 'Rôle supprimer');
            this.successmsg('Rôle supprimer', 'Suppression réussie');
          },
          error: (err) => {
            this.toastService.error(err.error.message, 'Rôle non supprimer');
            this.errormsg('Rôle non supprimer', err.error.message);
          },
        });
      }
    });
  }

  openModalListePermissionRole(role: Role, content: any) {
    this.openModal(content);
    this.idRole = role.id;
    this.chargerListePermissionRoleId();
  }

  chargerListePermissionRoleId() {
    this.utilisateurService.afficherLesPermissionsDuRole(this.idRole)
      .subscribe((response) => {
        this.permissionsDuRoles = response;
      });
  }

  onSearchPermission(searchItemPermission: string) {
    if (searchItemPermission.length >= 3) {
      this.utilisateurService.recherchePermission(searchItemPermission).subscribe(
        (response: any) => {
          this.permissions = response
        }, (error) => {
        }
      );
    }
  }

  openModalRetirerPermissionsRole(role: Role, content: any) {
    this.openModal(content);
    this.idRole = role.id;
    this.chargerListePermissionRoleId()
  }

  retirerUnePermission() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir retirer la/les permission(s). Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Retirer la/les !',
      cancelButtonText: 'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.retirerPermission();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // handle cancel action if necessary
      }
    }).catch((errors) => {
      this.toastService.error(errors.message, 'Permission non retirer');
      this.errormsg('Permission non retirer', errors.message);
    });
  }

  retirerPermission(): void {
    this.utilisateurService.retirerUnePermission(this.idRole, this.permissionIds)
      .subscribe((role: Role) => {
        this.role = role;
        this.permissionIds = []; // Réinitialise les permissions sélectionnées à une valeur vide
        this.modalService.dismissAll()
        this.successmsg('Permission(s) Retirer', 'La/Les permission(s) a/ont été retirée avec succes')
      }, (error) => {
        // Handle error (e.g., show an error message)
        console.error(error);
      });
  }


  openModalAjouterPermissionsRole(role: Role, content: any) {
    this.openModal(content);
    this.idRole = role.id;
  }

  ajouterUnePermission() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir ajouter la/les permission(s). Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Ajouter la/les !',
      cancelButtonText: 'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ajouterPermission();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // handle cancel action if necessary
      }
    }).catch((errors) => {
      this.toastService.error(errors.message, 'Permission non ajouter');
      this.errormsg('Permission non ajouter', errors.message);
    });
  }

  ajouterPermission(): void {
    this.utilisateurService.ajouterUnePermission(this.idRole, this.permissionIds)
      .subscribe((role: Role) => {
        this.role = role;
        this.permissionIds = []; // Réinitialise les permissions sélectionnées à une valeur vide
        this.modalService.dismissAll()
        this.successmsg('Permission(s) Ajouter', 'La/Les permission(s) a/ont été ajoutée avec succes')
      }, (error) => {
        // Handle error (e.g., show an error message)
        console.error(error);
      });
  }



}

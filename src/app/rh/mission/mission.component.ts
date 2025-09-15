import { Component, OnInit } from '@angular/core';
import { DataStateEnum, ModelDataState } from "../../state/state";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Mission } from "../models/mission";
import { Imputation } from "../models/imputation";
import { MissionnaireExterne } from "../models/missionnaire-externe";
import { Personnel } from "../models/personnel";
import { TypeMission } from "../models/type-mission";
import { FormControl, FormGroup, Validators } from "@angular/forms";
// @ts-ignore
import Hashids from 'hashids'
import { PersonnelService } from "../services/personnel.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MissionService } from "../services/mission.service";
import { TypeMissionService } from "../services/type-mission.service";
import { ImputationService } from "../services/imputation.service";
import { catchError, map, startWith } from "rxjs/operators";
import Swal from "sweetalert2";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { MissionnaireExterneService } from "../services/missionnaire-externe.service";
import { UtilisateurService } from '../../utilisateur/services/utilisateur.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})
export class MissionComponent implements OnInit {
  items: any[] = [];
  dataStateEnum = DataStateEnum
  state?: DataStateEnum
  dossiers?: Observable<ModelDataState<Mission[]>> //pour afficher au niveau de l'écran (fossier reçois la requete)
  listeDossierPage: Mission[] = [] //listePersonnelPage
  listeImputation: Imputation[] = []
  listeMissionnaireExterne: MissionnaireExterne[] = []
  listePersonnel: Personnel[] = []
  listeTypeMission: TypeMission[] = []
  public nom: string = '';
  public matricule: string = '';
  public prenom: string = '';
  public searchValue: string = '';
  public loading: boolean = false;
  public id?: number;
  public designation: string = '';
  public reference: string = '';
  public sigle: string = '';
  pieces: File | undefined
  // formulaireDossier = new FormGroup({
  //   id: new  FormControl(),
  //   objet: new FormControl('', [Validators.required]),
  //   accompagne: new FormControl(''),
  //   conducteur: new FormControl(null),
  //   personnels: new FormControl(),
  //   dateDebut: new FormControl(new Date, [Validators.required]),
  //   dateFin: new FormControl(new Date, [Validators.required]),
  //   imputation: new FormControl(null, [Validators.required]),
  //   missionnaireExternes: new FormControl(),
  //   moyenTransport: new FormControl(''),
  //   typeMission: new FormControl(null, [Validators.required]),
  // });

  formulaireDossier = new FormGroup({
    id: new FormControl(),
    dateDebut: new FormControl(new Date(), [Validators.required]),
    nbreJour: new FormControl<number | null>(null, [Validators.required]), // Changer à number
    objet: new FormControl(''),
    personnelId: new FormControl<number | null>(null, [Validators.required]),
    moyenDeplacement: new FormControl('', [Validators.required]), // Changer à string
  });

  totalDossier: number = 0;
  currentPage: number = 0;
  dossierPerPage: number = 10;
  sort: string = "desc";
  public pages: number[] = [];
  totalPages: number = 0;
  hashids: any
  devisSbj = new BehaviorSubject(0); // remove tab
  constructor(private dossierService: MissionService,
    private typemissionService: TypeMissionService,
    private missionnaireExterneService: MissionnaireExterneService,
    private imputationService: ImputationService,
    private personnelService: PersonnelService,
    private router: Router,
    private httpClient: HttpClient,
    private toastService: ToastrService,
    private utilisateurService: UtilisateurService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    this.hashids = new Hashids('mysecretkey');
    this.items = [
      { label: 'Ressources Humaines' },
      { label: 'Missions', active: true }
    ];
    this.chargerListeMissionPage();

    this.utilisateurService.personnelNonUtilisateur().subscribe(x => {
      this.listePersonnel = x;
    });
  }

  onSearchPersonnel(nom: string) {
    if (nom.length >= 3) {
      this.personnelService.recherchePersonnel(nom).subscribe(
        (response: any) => {
          this.listePersonnel = response.body.content
        }, (error) => {
        }
      );
    }
  }

  onSearchImputation(nom: string) {
    if (nom.length >= 3) {
      this.imputationService.rechercheImputation(nom).subscribe(
        (response: any) => {
          this.listeImputation = response.body.content
        }, (error) => {
        }
      );
    }
  }

  onSearchTypeMission(nom: string) {
    if (nom.length >= 3) {
      this.typemissionService.rechercheTypeMission(nom).subscribe(
        (response: any) => {
          this.listeTypeMission = response.body.content
        }, (error) => {
        }
      );
    }
  }

  onSearchMissionnaireExterne(nom: string) {
    if (nom.length >= 3) {
      this.missionnaireExterneService.rechercheMissionnaireExterneNom(nom).subscribe(
        (response: any) => {
          this.listeMissionnaireExterne = response.body.content
        }, (error) => {
        }
      );
    }
  }

  isTodayBetweenDates(startDate: Date, endDate: Date): boolean {
    const today = new Date();
    return startDate <= today && endDate >= today;
  }


  chargerListeMissionPage(): void {
    this.dossiers = this.dossierService
      .listerMissionPage(this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeDossierPage = response.body.content;
          this.totalDossier = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();

          // Comparaison des dates pour chaque mission
          this.listeDossierPage.forEach((mission: Mission) => {
            const startDate = new Date(mission.dateDebut); // Date de début de la mission
            const endDate = new Date(mission.dateFin); // Date de fin de la mission
            mission.isTodayBetweenDates = this.isTodayBetweenDates(startDate, endDate);
          });

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


  closeModal() {
    this.modalService.dismissAll()
  }

  successmsg(title = 'Mission ajouté !', message = 'Vous venez d\'ajoutez avec succès une nouvelle mission !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message: string) {
    Swal.fire(title, message, 'error');
  }



  handleClick() {
    if (this.reference) {
      this.searchRefecrence();
    } else
      this.chargerListeMissionPage()
  }

  searchRefecrence(): void { //fonction de recherche
    this.dossiers = this.dossierService.rechercheMissionPage(this.reference, this.sort)
      .pipe(
        map((response: any) => {
          this.listeDossierPage = response.body.content;
          // Comparaison des dates pour chaque mission
          this.listeDossierPage.forEach((mission: Mission) => {
            const startDate = new Date(mission.dateDebut); // Date de début de la mission
            const endDate = new Date(mission.dateFin); // Date de fin de la mission
            mission.isTodayBetweenDates = this.isTodayBetweenDates(startDate, endDate);
          });
          if (this.listeDossierPage.length === 0) {
            this.errormsg('Erreur', 'Aucun enregistrement ne correspond à votre recherche');
            this.chargerListeMissionPage()
          }
          this.totalDossier = response.body.totalElements;
          this.totalPages = response.body.totalPages
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listeDossierPage };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      ).pipe(
        catchError(err => {
          return of({ dataState: this.dataStateEnum.ERREUR, data: [] });
        })
      );
  }

  onPageChangeReference(event: any): void { //actionne la recherche
    this.currentPage = 0;
    this.dossierPerPage = 10;
    if (this.reference && this.reference?.length >= 3) {
      this.searchRefecrence();
      if (this.listeDossierPage.length === 0) {
        throw new Error('Aucun résultat trouvé pour la recherche.');
        this.errormsg('Erreur', 'Aucun résultat ne correspond à votre recherche');
      }
    } else if (!this.reference?.length) {
      this.chargerListeMissionPage();
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  encodeId(id: number) {
    return this.hashids.encode(id);
  }
  // encodeId(id: number | undefined): string {
  //   if (id === undefined || id === null) {
  //     return this.hashids.encode(0); // ou une valeur par défaut
  //   }
  //   return this.hashids.encode(id);
  // }


  openModal(content: any, dossier: Mission | undefined = undefined) {
    if (dossier) {
      this.formulaireDossier.patchValue(dossier as any);

    } else {
      this.formulaireDossier.reset();
    }
    this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  creerModifierMission() {
    if (this.formulaireDossier.valid) {
      const formData = new FormData();

      // Ajouter tous les champs du formulaire
      this.appendFormControlToFormData(formData, 'dateDebut', 'dateDebut');
      this.appendFormControlToFormData(formData, 'nbreJour', 'nbreJour');
      this.appendFormControlToFormData(formData, 'objet', 'objet');
      this.appendFormControlToFormData(formData, 'personnelId', 'personnelId');
      this.appendFormControlToFormData(formData, 'moyenDeplacement', 'moyenDeplacement');

      // Ajouter le fichier si présent
      if (this.pieces) {
        formData.append('pieces', this.pieces);
      }

      // Vérifier si c'est une modification ou une création
      const missionId = this.formulaireDossier.get('id')?.value;

      if (missionId) {
        // Modification
        this.dossierService.modifierMission(this.formulaireDossier.get("id")?.value, formData).subscribe(
           (response:any)=>{
              this.listeDossierPage.map(e =>{
                if (e.id == response["data"]?.id){
                  e.dateDebut = response["data"].dateDebut
                  e.nbreJour = response["data"].nbreJour
                  e.objet = response["data"].objet
                  e.personnel = response["data"].personnelId
                  e.moyenDeplacement = response["data"].moyenDeplacement
                }
                return e;
            });
            this.modalService.dismissAll();
            this.router.navigate(['/rh/missions/details/', this.encodeId(response?.id)]);
            this.successmsg("Mission modifiée", "La mission a été modifiée avec succès");
            this.formulaireDossier.reset();
          },
          (error) => {
            this.handleError(error);
          }
        );
      } else {
        // Création
        this.dossierService.creerMission(formData).subscribe(
          (response: any) => {
            this.listeDossierPage.unshift(response.data);
            this.formulaireDossier.reset();
            this.modalService.dismissAll();
            this.chargerListeMissionPage();
            this.successmsg("Mission créée", "La mission a été créée avec succès");
          },
          (error) => {
            this.handleError(error);
          }
        );
      }
    } else {
      this.toastService.error('Veuillez remplir tous les champs obligatoires', 'Erreur!');
    }
  }

  // Méthode utilitaire pour ajouter les champs au FormData
  private appendFormControlToFormData(formData: FormData, fieldName: string, controlName: string): void {
    const value = this.formulaireDossier.get(controlName)?.value;
    if (value !== null && value !== undefined && value !== '') {
      // Formater les dates correctement
      if (value instanceof Date) {
        formData.append(fieldName, value.toISOString().split('T')[0]);
      } else {
        formData.append(fieldName, value.toString());
      }
    }
  }

  // Méthode de gestion d'erreurs
  private handleError(error: any): void {
    if (error.error?.errors) {
      const errors = error.error.errors;
      for (let i = 0; i < errors.length; i++) {
        const currentError = errors[i];
        this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
      }
    } else {
      this.toastService.error(
        error.error?.message || 'Erreur lors de l\'opération',
        'Erreur!'
      );
    }
  }


  supprimerMission(id: number) {
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
        this.dossierService.supprimerMission(id).subscribe({
          next: (value) => {
            this.devisSbj.next(0);
            this.listeDossierPage = this.listeDossierPage.filter(
              (i) => i.id !== id
            );
            this.successmsg('Suppression réussie', 'Mission supprimer');
          },
          error: (err) => {
            this.errormsg('Mission non supprimer', err.error.message);
          },
        });
      }
    });
  }

  openModalRapport(content: any, mission: Mission) {
    this.id = mission.id
    this.modalService.open(content)
  }

  ajouterRapport() {
    const formData = new FormData(); //objet formdata
    formData.append('file', this.pieces as File); //mettre le ifhcier dans le formulaire
    this.dossierService.ajouterLeRapport(this.id, formData)
      .subscribe(
        (response: any) => {
          this.modalService.dismissAll()
          this.chargerListeMissionPage()
          this.successmsg("Rapport ajouté", "Le rapport a été ajouté avec succès")
        },
        (error) => {
          const errors = error.error.errors;
          for (let i = 0; i < errors.length; i++) {
            const currentError = errors[i];
            this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
          }
        }
      )
  }

  uploaderFicher($event: any) {
    if ($event.target.files.length > 0) {
      this.pieces = $event.target.files[0];
    }
  }


  telechargerRapportMission(mission: Mission) {
    const url = `${this.dossierService.contextPath}/telecharger/` + mission?.pieces;


    // Récupérer le token depuis la session storage
    const authToken = sessionStorage.getItem("token");

    // Vérifier si le token est présent
    if (!authToken) {
      throw new Error("Authorization token not found");
    }

    // Ajouter le token à l'en-tête
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Utilisation de la méthode HTTP GET pour télécharger le fichier
    return this.httpClient.get(url, { responseType: 'arraybuffer', headers })
      .pipe(
        catchError(this.handleErrorr)  // Gérer les erreurs si nécessaire
      );
  }

  private handleErrorr(error: any): Observable<any> {
    console.error('Une erreur s\'est produite:', error);
    throw new Error('Une erreur s\'est produite lors de la requête HTTP.');
  }

  showPopOnDownloadRapportMission() {
    this.successmsg(
      'Rapport de Mission telecharger',
      "Le Rapport de la Mission a été bien téléchargé avec succès"
    );
  }

}

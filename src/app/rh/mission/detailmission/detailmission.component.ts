import { Component, OnInit } from '@angular/core';
import {DataStateEnum, ModelDataState} from "../../../state/state";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Mission} from "../../models/mission";
import {MissionPointage} from "../../models/mission-pointage";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MissionService} from "../../services/mission.service";
import {TypeMissionService} from "../../services/type-mission.service";
import {MissionnaireExterneService} from "../../services/missionnaire-externe.service";
import {ImputationService} from "../../services/imputation.service";
import {PersonnelService} from "../../services/personnel.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MissionPointageService} from "../../services/mission-pointage.service";
// @ts-ignore
import Hashids from 'hashids'
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {Imputation} from "../../models/imputation";
import {MissionnaireExterne} from "../../models/missionnaire-externe";
import {Personnel} from "../../models/personnel";
import {TypeMission} from "../../models/type-mission";
import {catchError, map, startWith} from "rxjs/operators";
import Swal from "sweetalert2";
import {Facteur} from "../../models/facteur";
import {FacteurService} from "../../services/facteur.service";

@Component({
  selector: 'app-detailmission',
  templateUrl: './detailmission.component.html',
  styleUrls: ['./detailmission.component.scss']
})
export class DetailmissionComponent implements OnInit {

  items: Array<{}>;
  dataStateEnum = DataStateEnum
  state: DataStateEnum
  mission$: Observable<ModelDataState<Mission | undefined>>;
  pointages: Observable<ModelDataState<MissionPointage[] >>;
  mission: Mission;
  listePointage: MissionPointage[] = []
  listeDossierPage: Mission[] = [] //listePersonnelPage
  listeImputation: Imputation[] = []
  listeMissionnaireExterne: MissionnaireExterne[] = []
  listeMissionnaireExterneMission: MissionnaireExterne[] = []
  listePersonnel: Personnel[] = []
  listePersonnelMission: Personnel[] = []
  listeFacteur: Facteur[] = []
  listeTypeMission: TypeMission[] = []
  public nom:string;
  public matricule:string;
  public prenom: string;
  public searchValue: string = '';
  public loading:boolean=false;
  public id:number;
  public designation:string;
  public reference:string;
  public sigle:string;
  file:File|undefined
  formulaireDossier = new FormGroup({
    id: new  FormControl(),
    objet: new FormControl('', [Validators.required]),
    accompagne: new FormControl(''),
    conducteur: new FormControl(null),
    personnels: new FormControl(),
    dateDebut: new FormControl(new Date, [Validators.required]),
    dateFin: new FormControl(new Date, [Validators.required]),
    imputation: new FormControl(null, [Validators.required]),
    missionnaireExternes: new FormControl(),
    moyenTransport: new FormControl(''),
    typeMission: new FormControl(null, [Validators.required]),
  });
  formulairePointage = new FormGroup({
    id: new  FormControl(),
    date: new FormControl('', [Validators.required]),
    facteur: new FormControl(null, [Validators.required]),
    personnel: new FormControl(null,[Validators.required]),
    mission: new FormControl(),
  })
  totalDossier : number = 0;
  currentPage: number = 0;
  dossierPerPage: number = 10;
  sort: string = "desc";
  public pages: number[] = [];
  totalPages: number;
  hashids : any
  private id$: any;
  devisSbj = new BehaviorSubject(0); // remove tab
  constructor(private dossierService: MissionService,
              private typemissionService:TypeMissionService,
              private missionPointageService:MissionPointageService,
              private facteurService:FacteurService,
              private activatedRoute:ActivatedRoute,
              private missionnaireExterneService:MissionnaireExterneService,
              private imputationService:ImputationService,
              private personnelService:PersonnelService,
              private router:Router,
              private toastService:ToastrService,
              private modalService:NgbModal) { }
  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    this.hashids = new Hashids('mysecretkey');
    this.activatedRoute.paramMap.subscribe((params) => {
      const encodedId = params.get('id');
      this.id$ = this.decodeId(encodedId);
    });
    this.items = [
      { label: 'Ressources Humaines' },
      { label: 'Mission' },
      { label: 'Details', active: true },
    ];
    this.chargerIdMission(this.id$);
  }

  decodeId(encodedId: string) {
    const [id] = this.hashids.decode(encodedId);
    return id;
  }

  encodeId(id: number) {
    return this.hashids.encode(id);
  }

  onSearchPersonnel(nom: string){
    if(nom.length >= 3){
      this.personnelService.recherchePersonnel(nom).subscribe(
        (response : any) => {
          this.listePersonnel = response.body.content
        },(error)=>{
        }
      );
    }
  }

  onSearchImputation(nom: string){
    if(nom.length >= 3){
      this.imputationService.rechercheImputation(nom).subscribe(
        (response : any) => {
          this.listeImputation = response.body.content
        },(error)=>{
        }
      );
    }
  }

  onSearchTypeMission(nom: string){
    if(nom.length >= 3){
      this.typemissionService.rechercheTypeMission(nom).subscribe(
        (response : any) => {
          this.listeTypeMission = response.body.content
        },(error)=>{
        }
      );
    }
  }

  onSearchMissionnaireExterne(nom: string){
    if(nom.length >= 3){
      this.missionnaireExterneService.rechercheMissionnaireExterneNom(nom).subscribe(
        (response : any) => {
          this.listeMissionnaireExterne = response.body.content
        },(error)=>{
        }
      );
    }
  }

  onSearchFacteur(nom: string){
    if(nom.length >= 3){
      this.facteurService.rechercheFacteur(nom).subscribe(
        (response : any) => {
          this.listeFacteur = response.body.content
        },(error)=>{
        }
      );
    }
  }

  isTodayBetweenDates(startDate: Date, endDate: Date): boolean {
    const today = new Date();
    return startDate <= today && endDate >= today;
  }

  chargerIdMission(id) {
    this.activatedRoute.params.subscribe((params) => {
      this.chargeInformationMission(id);
      this.chargerListePointageMission()
    });
  }
  chargeInformationMission(id: number) {
    this.mission$ = this.dossierService.voirMission(id)
      .pipe(
        map((response) => {
          this.mission = response;
          this.listePersonnelMission = response.personnels
          this.listeMissionnaireExterneMission = response.missionnaireExternes
          const startDate = new Date(this.mission.dateDebut); // Date de début de la mission
          const endDate = new Date(this.mission.dateFin); // Date de fin de la mission
          this.mission.isTodayBetweenDates = this.isTodayBetweenDates(startDate, endDate);
          this.mission.duree = this.calculerDureeMission(startDate, endDate);
          return { dataState: DataStateEnum.CHARGE, data: { ...response } };
        }),
        startWith({ dataState: DataStateEnum.CHARGEMENT })
      )
      .pipe(
        catchError((err) => {
          return of({ dataState: this.dataStateEnum.CHARGE, data: undefined });
        })
      );
  }

  calculerDureeMission(startDate: Date, endDate: Date): string {
    const diffInMilliseconds = Math.abs(endDate.getTime() - startDate.getTime());
    const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    let duration = '';
    if (years > 0) {
      duration += years + ' an' + (years > 1 ? 's' : '') + ' ';
    }
    if (months > 0) {
      duration += months + ' mois ';
    }
    if (days > 0) {
      duration += days + ' jour' + (days > 1 ? 's' : '');
    }

    return duration.trim();
  }


  goBack(): void {
    this.router.navigate(['rh/missions']);
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  successmsg(title = 'Mission ajouté !', message = 'Vous venez d\'ajoutez avec succès une nouvelle mission !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message) {
    Swal.fire(title, message, 'error');
  }

  openModal(content: any, dossier: Mission | undefined = undefined) {
    if (dossier) {
      this.formulaireDossier.patchValue(dossier as any);
      this.formulaireDossier.get('conducteur').setValue(dossier?.conducteur?.prenom + ' ' + dossier?.conducteur?.nom);
      this.formulaireDossier.get('personnels').setValue(
        this.formulaireDossier.get('personnels').value.map(personnel => personnel?.prenom + ' ' + personnel?.nom)
      );
      this.formulaireDossier.get('imputation').setValue(dossier?.imputation?.nom);
      this.formulaireDossier.get('missionnaireExternes').setValue(
        this.formulaireDossier.get('missionnaireExternes').value.map(missionnaireExterne =>
          missionnaireExterne?.prenom + ' ' + missionnaireExterne?.nom
        )
      );
      this.formulaireDossier.get('typeMission').setValue(dossier?.typeMission?.nom);
    } else {
      this.formulaireDossier.reset();
      this.formulaireDossier.get('conducteur').setValue(null);
      this.formulaireDossier.get('imputation').setValue(null);
      this.formulaireDossier.get('typeMission').setValue(null);
    }
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  creerModifierMission() {
    if (this.formulaireDossier.valid) {
      if (this.formulaireDossier.get('id').value) {
        this.dossierService.modifierMission(this.formulaireDossier.get("id").value, this.formulaireDossier.value)
          .subscribe(
            (response) => {
              this.listeDossierPage.map(e => {
                if (e.id == response["data"].id) {
                  e.objet = response["data"].objet;
                  e.accompagne = response["data"].accompagne;
                  e.conducteur = response["data"].conducteur;
                  e.personnels = response["data"].personnels;
                  e.dateDebut = response["data"].dateDebut;
                  e.dateFin = response["data"].dateFin;
                  e.imputation = response["data"].imputation;
                  e.missionnaireExternes = response["data"].missionnaireExternes;
                  e.moyenTransport = response["data"].moyenTransport;
                  e.typeMission = response["data"].typeMission;
                }
                return e;
              });
              this.modalService.dismissAll();
              this.chargerIdMission(this.id$)
              this.successmsg("Mission modifier", "La Mission a été modifié avec succès");
              this.formulaireDossier.reset();
            },
            (error) => {
              const errors = error.error.errors;
              for (let i = 0; i < errors.length; i++) {
                const currentError = errors[i];
                this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
              }
            }
          );
      } else {
        const personnels = this.formulaireDossier.get('personnels').value;
        const missionnaireExternes = this.formulaireDossier.get('missionnaireExternes').value;
        const formData = { ...this.formulaireDossier.value, personnels: personnels || [], missionnaireExternes: missionnaireExternes || [] };
        this.dossierService.creerMission(formData).subscribe(
          (response) => {
            this.listeDossierPage.unshift(response['data']);
            this.formulaireDossier.reset();
            this.modalService.dismissAll();
            this.chargerIdMission(this.id$)
            this.successmsg();
          },
          (error) => {
            const errors = error.error.errors;
            for (let i = 0; i < errors.length; i++) {
              const currentError = errors[i];
              this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
            }
          }
        );
      }
    }
  }



  supprimerMission() {
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
        this.dossierService.supprimerMission(this.id$).subscribe({
          next: (value) => {
            this.devisSbj.next(0);
            this.listeDossierPage = this.listeDossierPage.filter(
              (i) => i.id !== this.id$
            );
            this.goBack()
            this.successmsg('Suppression réussie', 'Mission supprimer');
          },
          error: (err) => {
            this.errormsg('Mission non supprimer', err.error.message);
          },
        });
      }
    });
  }

  openModalRapport(content:any, mission:Mission) {
    this.id = mission.id
    this.modalService.open(content)
  }

  ajouterRapport(){
    const formData = new FormData(); //objet formdata
    formData.append('file', this.file as File); //mettre le ifhcier dans le formulaire
    this.dossierService.ajouterLeRapport(this.id, formData)
      .subscribe(
        (response)=>{
          this.modalService.dismissAll()
          this.chargerIdMission(this.id$)
          this.successmsg("Rapport ajouté", "Le rapport a été ajouté avec succès")
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

  uploaderFicher($event: any) {
    if($event.target.files.length > 0){
      this.file = $event.target.files[0];
    }
  }


  telechargerRapportMission(mission: Mission) {
    return `${this.dossierService.contextPath}/telecharger/` + mission?.rapport;
  }

  showPopOnDownloadRapportMission() {
    this.successmsg(
      'Rapport de Mission telecharger',
      "Le Rapport de la Mission a été bien téléchargé avec succès"
    );
  }


  chargerListePointageMission() {
    this.pointages = this.dossierService.listerPointageParMissionPage(this.id$, this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listePointage = response.body.content;
          this.totalDossier = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return {
            dataState: this.dataStateEnum.CHARGE,
            data: this.listePointage,
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

  openModalPiontage(content:any, missionPointage:MissionPointage | undefined = undefined){
    if (missionPointage){
      this.formulairePointage.patchValue(missionPointage as any)
      this.formulairePointage.get('personnel').setValue(missionPointage?.personnel?.id.toString())
      this.formulairePointage.get('facteur').setValue(missionPointage?.facteur?.nom?.toString())
    }else{
      this.formulairePointage.reset()
      this.formulairePointage.get('mission').setValue(this.id$)
    }
    this.modalService.open(content)

  }



  pointerPersonnelMission() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir le pointer pour cette mission? Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Pointer !',
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.creeModifierPointage();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // handle cancel action if necessary
      }
    }).catch((error) => {
    });
  }

  creeModifierPointage() {
    if (this.formulairePointage.valid) {
      const datePointage = new Date(this.formulairePointage.get('date').value);
      const dateDebutMission = new Date(this.mission.dateDebut);
      const dateFinMission = new Date(this.mission.dateFin);

      if (datePointage >= dateDebutMission && datePointage <= dateFinMission) {
        // La date de pointage est valide, vous pouvez enregistrer le pointage
        if (this.formulairePointage.get('id').value) {
          this.missionPointageService.modifierMissionPointage(this.formulairePointage.get('id').value, this.formulairePointage.value)
            .subscribe(
              (response) => {
                this.listePointage.map((e) => {
                  if (e.id == response['data'].id) {
                    e.date = response['data'].date;
                    e.personnel = response['data'].personnel;
                    e.facteur = response['data'].facteur;
                  }
                  return e;
                });
                this.modalService.dismissAll();
                this.chargerIdMission(this.id$);
                this.successmsg('Pointage modifié', 'Le Pointage a été modifié avec succès');
                this.formulairePointage.reset();
              },
              (error) => {
                const errors = error.error.errors;
                for (let i = 0; i < errors.length; i++) {
                  const currentError = errors[i];
                  this.toastService.error(currentError.champs + ': ' + currentError.message, 'Erreur!');
                }
              }
            );
        } else {
          this.missionPointageService.creerMissionPointage(this.formulairePointage.value)
            .subscribe(
              (response) => {
                this.listePointage.unshift(response['data']);
                this.formulairePointage.reset();
                this.modalService.dismissAll();
                this.chargerIdMission(this.id$);
                this.successmsg('Pointage personnel mission réussi', 'Le personnel a été pointé avec succès à cette mission');
              },
              (error) => {
                const errors = error.error.errors;
                for (let i = 0; i < errors.length; i++) {
                  const currentError = errors[i];
                  this.toastService.error(currentError.champs + ': ' + currentError.message, 'Erreur!');
                }
              }
            );
        }
      } else {
        // La date de pointage est invalide, affichez un message d'erreur
        this.toastService.error('La date de pointage est en dehors de la période de la mission', 'Erreur!');
      }
    }
  }


  supprimerPiontage(id: number) {
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
        this.missionPointageService.supprimerMissionPointage(id).subscribe({
          next: (value) => {
            this.devisSbj.next(0);
            this.listePointage = this.listePointage.filter(
              (i) => i.id !== id
            );
            this.chargerIdMission(this.id$)
            this.successmsg('Suppression réussie', 'Pointage supprimer');
          },
          error: (err) => {
            this.errormsg('Pointage non supprimer', err.error.message);
          },
        });
      }
    });
  }


  genererLesEtats(mission:Mission) {
    this.reference = mission.reference
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir générer les états de paiemants de la mission  '+this.reference+'  ? Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Générer les !',
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onDownloadEtat();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // handle cancel action if necessary
      }
    }).catch((errors) => {
      this.toastService.error(errors.message, 'Etat de paiemant non générer et télécharger');
      this.errormsg('Etat de paiemant non générer et télécharger', errors.message);
    });
  }


  onDownloadEtat(): void {
    this.dossierService.genererEtatDePaiement(this.id$).subscribe(
      (data) => {
        const currentDate = new Date();
        const fileName = `etat_de_paiement_de_la_mission_${this.reference}_${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}_${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}.pdf`;
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        this.successmsg('Générer etat de paiement réussie', 'Les états de paiements de cette mission a été générer et télécharger avec succès');
      },
      (error) => {
        const errors = error.error.errors;
        for (let i = 0; i < errors.length; i++) {
          const currentError = errors[i];
          this.toastService.error(currentError.champs + ': ' + currentError.message, 'Erreur!');
        }
      }
    );
  }


  telechargerFrais(mission:Mission) {
    this.reference = mission.reference
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir Télécharger la fiche des frais de la mission '+this.reference+' ? Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Télécharger les !',
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoadingModalFrais(); // Afficher le modal de chargement
        this.onDownloadFrais();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // handle cancel action if necessary
      }
    }).catch((errors) => {
      this.toastService.error(errors.message, 'Fiche Frais de mission non Télécharger');
      this.errormsg('Fiche Frais de mission non Télécharger', errors.message);
    });
  }


  onDownloadFrais(): void {
        this.loading = true; // Afficher l'indicateur de chargement

    this.dossierService.telechargerFraisMission(this.id$).subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        this.loading = false; // Fermer l'indicateur de chargement une fois la requête terminée
        this.hideLoadingModal(); // Cacher le modal de chargement
        this.successmsg('Télécharger frais de mission réussie', 'Les frais de la mission '+this.reference+' ont été et télécharger avec succès, veillez svp vérifier dans votre dossiers téléchargement pour les retrouver');
      },
      (error) => {
        const errors = error.error.errors;
        for (let i = 0; i < errors.length; i++) {
          const currentError = errors[i];
          this.toastService.error(currentError.champs + ': ' + currentError.message, 'Erreur!');
        }
      }
    )
  }


  telechargerOrdre(mission:Mission) {
    this.reference = mission.reference
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir Télécharger les ordres de la mission '+this.reference+' ? Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Télécharger les !',
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoadingModalOrdre(); // Afficher le modal de chargement
        this.onDownloadOrdre();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // handle cancel action if necessary
      }
    }).catch((errors) => {
      this.toastService.error(errors.message, 'Ordre de la mission non Télécharger');
      this.errormsg('Ordre de la mission non Télécharger', errors.message);
    });
  }


  onDownloadOrdre(): void {
        this.loading = true; // Afficher l'indicateur de chargement

    this.dossierService.telechargerOrdreMission(this.id$).subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        this.loading = false; // Fermer l'indicateur de chargement une fois la requête terminée
        this.hideLoadingModal(); // Cacher le modal de chargement
        this.successmsg('Téléchargement de l\'ordre de mission réussi', 'Les ordres de la mission ' + this.reference + ' ont été téléchargés avec succès, veillez svp vérifier dans votre dossiers téléchargement sur votre ordinateur pour les retrouver');
      },
      (error) => {
        const errors = error.error.errors;
        for (let i = 0; i < errors.length; i++) {
          const currentError = errors[i];
          this.toastService.error(currentError.champs + ': ' + currentError.message, 'Erreur!');
        }
      })
  }

  showLoadingModalFrais() {
    Swal.fire({
      title: 'Génération et Téléchargement en cours',
      html: 'Veuillez patienter... Les Frais de mission sont en train d\'être générées et telechargées.',
      allowOutsideClick: false,
      didOpen: () => {
        // @ts-ignore
        Swal.showLoading();
      }
    });
  }


  showLoadingModalOrdre() {
    Swal.fire({
      title: 'Génération et Téléchargement en cours',
      html: 'Veuillez patienter... Les Ordres de mission sont en train d\'être générées et telechargées.',
      allowOutsideClick: false,
      didOpen: () => {
        // @ts-ignore
        Swal.showLoading();
      }
    });
  }

  hideLoadingModal() {
    Swal.close();
  }


}

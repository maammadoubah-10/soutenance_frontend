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
import { UtilisateurService } from '../../../utilisateur/services/utilisateur.service';

@Component({
  selector: 'app-detailmission',
  templateUrl: './detailmission.component.html',
  styleUrls: ['./detailmission.component.scss']
})
export class DetailmissionComponent implements OnInit {

  items: any[] = [];
  dataStateEnum = DataStateEnum;
  state?: DataStateEnum;
  mission$?: Observable<ModelDataState<Mission | undefined>>;
  pointages?: Observable<ModelDataState<MissionPointage[] >>;
  mission?: Mission;
  listePointage: MissionPointage[] = [];
  listeDossierPage: Mission[] = [];
  listeImputation: Imputation[] = [];
  listeMissionnaireExterne: MissionnaireExterne[] = [];
  listeMissionnaireExterneMission: MissionnaireExterne[] = [];
  listePersonnel: Personnel[] = [];
  listePersonnelMission: Personnel[] = [];
  listeFacteur: Facteur[] = [];
  listeTypeMission: TypeMission[] = [];
  public nom:string = '';
  public matricule:string = '';
  public prenom: string = '';
  public searchValue: string = '';
  public loading:boolean=false;
  public id?:number;
  public designation:string = '';
  public reference:string = '';
  public sigle:string = '';
  pieces:File|undefined;

  formulaireDossier = new FormGroup({
    id: new FormControl(),
    dateDebut: new FormControl(new Date(), [Validators.required]),
    nbreJour: new FormControl<number | null>(null, [Validators.required]),
    objet: new FormControl(''),
    personnelId: new FormControl<number | null>(null, [Validators.required]),
    moyenDeplacement: new FormControl('', [Validators.required]),
  });

  formulairePointage = new FormGroup({
    id: new  FormControl(),
    date: new FormControl('', [Validators.required]),
    facteur: new FormControl<string | null>(null, [Validators.required]),
    personnel: new FormControl<string | null>(null,[Validators.required]),
    mission: new FormControl(),
  });

  totalDossier : number = 0;
  currentPage: number = 0;
  dossierPerPage: number = 10;
  sort: string = "desc";
  public pages: number[] = [];
  totalPages: number = 0;
  hashids : any;
  private id$: any;
  devisSbj = new BehaviorSubject(0);

  constructor(
    private dossierService: MissionService,
    private typemissionService:TypeMissionService,
    private missionPointageService:MissionPointageService,
    private facteurService:FacteurService,
    private activatedRoute:ActivatedRoute,
    private missionnaireExterneService:MissionnaireExterneService,
    private imputationService:ImputationService,
    private personnelService:PersonnelService,
    private utilisateurService:UtilisateurService,
    private router:Router,
    private toastService:ToastrService,
    private modalService:NgbModal
  ) { }

  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    this.hashids = new Hashids('mysecretkey');

    this.activatedRoute.paramMap.subscribe((params) => {
      const encodedId = params.get('id');
      if (encodedId) {
        this.id$ = this.decodeId(encodedId);
      } else {
        this.id$ = null;
      }
    });

    this.items = [
      { label: 'Ressources Humaines' },
      { label: 'Mission' },
      { label: 'Details', active: true },
    ];
    this.chargerIdMission(this.id$);

    this.utilisateurService.personnelNonUtilisateur().subscribe(x => {
      this.listePersonnel = x;
    });
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
        (response : any) => { this.listePersonnel = response.body.content },
        (_error: any)=>{}
      );
    }
  }

  onSearchImputation(nom: string){
    if(nom.length >= 3){
      this.imputationService.rechercheImputation(nom).subscribe(
        (response : any) => { this.listeImputation = response.body.content },
        (_error: any)=>{}
      );
    }
  }

  onSearchTypeMission(nom: string){
    if(nom.length >= 3){
      this.typemissionService.rechercheTypeMission(nom).subscribe(
        (response : any) => { this.listeTypeMission = response.body.content },
        (_error: any)=>{}
      );
    }
  }

  onSearchMissionnaireExterne(nom: string){
    if(nom.length >= 3){
      this.missionnaireExterneService.rechercheMissionnaireExterneNom(nom).subscribe(
        (response : any) => { this.listeMissionnaireExterne = response.body.content },
        (_error: any)=>{}
      );
    }
  }

  onSearchFacteur(nom: string){
    if(nom.length >= 3){
      this.facteurService.rechercheFacteur(nom).subscribe(
        (response : any) => { this.listeFacteur = response.body.content },
        (_error: any)=>{}
      );
    }
  }

  isTodayBetweenDates(startDate: Date, endDate: Date): boolean {
    const today = new Date();
    return startDate <= today && endDate >= today;
  }

  chargerIdMission(id:number) {
    this.activatedRoute.params.subscribe((_params) => {
      this.chargeInformationMission(id);
      this.chargerListePointageMission();
    });
  }

  chargeInformationMission(id: number) {
    this.mission$ = this.dossierService.voirMission(id)
      .pipe(
        map((response:any) => {
          this.mission = response;
          this.listePersonnelMission = response.personnels;
          this.listeMissionnaireExterneMission = response.missionnaireExternes;
          if (this.mission && this.mission.dateDebut && this.mission.dateFin) {
            const startDate = new Date(this.mission.dateDebut);
            const endDate = new Date(this.mission.dateFin);
            this.mission.isTodayBetweenDates = this.isTodayBetweenDates(startDate, endDate);
            this.mission.duree = this.calculerDureeMission(startDate, endDate);
          }
          return { dataState: DataStateEnum.CHARGE, data: { ...response } };
        }),
        startWith({ dataState: DataStateEnum.CHARGEMENT }),
        catchError((_err: any) => of({ dataState: this.dataStateEnum.CHARGE, data: undefined }))
      );
  }

  calculerDureeMission(startDate: Date, endDate: Date): string {
    const diffInMilliseconds = Math.abs(endDate.getTime() - startDate.getTime());
    const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    let duration = '';
    if (years > 0) duration += years + ' an' + (years > 1 ? 's' : '') + ' ';
    if (months > 0) duration += months + ' mois ';
    if (days > 0) duration += days + ' jour' + (days > 1 ? 's' : '');
    return duration.trim();
  }

  goBack(): void { this.router.navigate(['rh/missions']); }

  closeModal() { this.modalService.dismissAll(); }

  successmsg(title = 'Mission ajouté !', message = 'Vous venez d\'ajoutez avec succès une nouvelle mission !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message:string) { Swal.fire(title, message, 'error'); }

  openModal(content: any, dossier: Mission | undefined = undefined) {
    if (dossier) {
      this.formulaireDossier.patchValue(dossier as any);
    } else {
      this.formulaireDossier.reset();
    }
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  creerModifierMission() {
    if (!this.formulaireDossier.valid) {
      this.toastService.error('Veuillez remplir tous les champs obligatoires', 'Erreur!');
      return;
    }

    const formData = new FormData();
    this.appendFormControlToFormData(formData, 'dateDebut', 'dateDebut');
    this.appendFormControlToFormData(formData, 'nbreJour', 'nbreJour');
    this.appendFormControlToFormData(formData, 'objet', 'objet');
    this.appendFormControlToFormData(formData, 'personnelId', 'personnelId');
    this.appendFormControlToFormData(formData, 'moyenDeplacement', 'moyenDeplacement');

    if (this.pieces) formData.append('pieces', this.pieces);

    const missionId = this.formulaireDossier.get('id')?.value;

    if (missionId) {
      this.dossierService.modifierMission(this.formulaireDossier.get("id")?.value, formData).subscribe(
        (response:any)=>{
          this.listeDossierPage.map(e =>{
            if (e.id == response["data"].id){
              e.dateDebut = response["data"].dateDebut;
              e.nbreJour = response["data"].nbreJour;
              e.objet = response["data"].objet;
              // @ts-ignore
              e.personnel = response["data"].personnelId;
              e.moyenDeplacement = response["data"].moyenDeplacement;
            }
            return e;
          });
          this.modalService.dismissAll();
          this.router.navigate(['/rh/missions/details/', this.encodeId(response.data?.id)]);
          this.successmsg("Mission modifiée", "La mission a été modifiée avec succès");
          this.formulaireDossier.reset();
        },
        (error: any) => this.handleError(error)
      );
    } else {
      this.dossierService.creerMission(formData).subscribe(
        (response: any) => {
          this.listeDossierPage.unshift(response.data);
          this.formulaireDossier.reset();
          this.modalService.dismissAll();
          this.chargerIdMission(this.id$);
          this.successmsg("Mission créée", "La mission a été créée avec succès");
        },
        (error: any) => this.handleError(error)
      );
    }
  }

  private handleError(error: any): void {
    if (error.error?.errors) {
      const errors = error.error.errors;
      for (let i = 0; i < errors.length; i++) {
        const currentError = errors[i];
        this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
      }
    } else {
      this.toastService.error(error.error?.message || 'Erreur lors de l\'opération','Erreur!');
    }
  }

  private appendFormControlToFormData(formData: FormData, fieldName: string, controlName: string): void {
    const value = this.formulaireDossier.get(controlName)?.value;
    if (value !== null && value !== undefined && value !== '') {
      if (value instanceof Date) {
        formData.append(fieldName, value.toISOString().split('T')[0]);
      } else {
        formData.append(fieldName, value.toString());
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
          next: (_value: any) => {
            this.devisSbj.next(0);
            this.listeDossierPage = this.listeDossierPage.filter((i) => i.id !== this.id$);
            this.goBack();
            this.successmsg('Suppression réussie', 'Mission supprimer');
          },
          error: (err: any) => {
            this.errormsg('Mission non supprimer', err.error.message);
          },
        });
      }
    });
  }

  openModalRapport(content:any, mission:Mission) {
    this.id = mission.id;
    this.modalService.open(content);
  }

  // ✅ Corrige TS2345 (this.id peut être undefined)
  ajouterRapport(){
    if (!this.id) {
      this.toastService.error('Mission inconnue', 'Rapport');
      return;
    }
    if (!this.pieces) {
      this.toastService.error('Veuillez sélectionner un fichier', 'Rapport');
      return;
    }
    const formData = new FormData();
    formData.append('pieces', this.pieces as File);
    this.dossierService.ajouterLeRapport(this.id!, formData) // <-- non-null assertion
      .subscribe(
        (_response: any)=>{
          this.modalService.dismissAll();
          this.chargerIdMission(this.id$);
          this.successmsg("Rapport ajouté", "Le rapport a été ajouté avec succès");
        },
        (error: any)=> {
          const errors = error?.error?.errors;
          if (errors?.length) {
            for (let i = 0; i < errors.length; i++) {
              const currentError = errors[i];
              this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
            }
          } else {
            this.toastService.error(error?.error?.message || 'Erreur inconnue', 'Rapport');
          }
        }
      );
  }

  uploaderFicher($event: any) {
    if($event.target.files.length > 0){
      this.pieces= $event.target.files[0];
    }
  }

  showPopOnDownloadRapportMission() {
    this.successmsg('Rapport de Mission telecharger',"Le Rapport de la Mission a été bien téléchargé avec succès");
  }

  chargerListePointageMission() {
    this.pointages = this.dossierService.listerPointageParMissionPage(this.id$, this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listePointage = response.body.content;
          this.totalDossier = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listePointage };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT }),
        catchError((_err: any) => of({ dataState: this.dataStateEnum.ERREUR, data: [] }))
      );
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) pages.push(i);
    return pages;
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
    }).then((_result) => {}).catch((_error: any) => {});
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
          next: (_value: any) => {
            this.devisSbj.next(0);
            this.listePointage = this.listePointage.filter((i) => i.id !== id);
            this.chargerIdMission(this.id$);
            this.successmsg('Suppression réussie', 'Pointage supprimer');
          },
          error: (err: any) => {
            this.errormsg('Pointage non supprimer', err.error.message);
          },
        });
      }
    });
  }

  genererLesEtats(mission:Mission) {
    this.reference = mission.reference;
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
      }
    }).catch((errors: any) => {
      this.toastService.error(errors.message, 'Etat de paiemant non générer et télécharger');
      this.errormsg('Etat de paiemant non générer et télécharger', errors.message);
    });
  }

  onDownloadEtat(): void {
    this.dossierService.genererEtatDePaiement(Number(this.id$)).subscribe(
      (data:any) => {
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
      (error: any) => {
        const errors = error?.error?.errors;
        if (errors?.length) {
          for (let i = 0; i < errors.length; i++) {
            const currentError = errors[i];
            this.toastService.error(currentError.champs + ': ' + currentError.message, 'Erreur!');
          }
        } else {
          this.toastService.error(error?.error?.message || 'Erreur lors de la génération', 'Erreur!');
        }
      }
    );
  }

  telechargerFrais(mission:Mission) {
    this.reference = mission.reference;
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir Télécharger la fiche  de la mission '+this.mission?.motif+' ? Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Télécharger les !',
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoadingModalFrais();
        this.onDownloadFrais();
      }
    }).catch((errors: any) => {
      this.toastService.error(errors.message, 'Fiche Frais de mission non Télécharger');
      this.errormsg('Fiche Frais de mission non Télécharger', errors.message);
    });
  }

  onDownloadFrais(): void {
    this.loading = true;
    this.dossierService.telechargerFraisMission(Number(this.id$)).subscribe(
      (data: any) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fiche-frais-mission-${this.reference}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.loading = false;
        this.hideLoadingModal();
        this.successmsg('Téléchargement réussi','La fiche de frais a été téléchargée avec succès.');
      },
      (error: any) => {
        this.loading = false;
        this.hideLoadingModal();
        const errors = error?.error?.errors;
        if (errors?.length) {
          for (let i = 0; i < errors.length; i++) {
            const currentError = errors[i];
            this.toastService.error(currentError.champs + ': ' + currentError.message, 'Erreur!');
          }
        } else {
          this.toastService.error('Erreur lors du téléchargement', 'Erreur!');
        }
      }
    );
  }

  telechargerOrdre(mission:Mission) {
    this.reference = mission.reference;
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir Télécharger l attestation e la mission '+this.reference+' ? Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Télécharger les !',
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoadingModalOrdre();
        this.onDownloadOrdre();
      }
    }).catch((errors: any) => {
      this.toastService.error(errors.message, 'Ordre de la mission non Télécharger');
      this.errormsg('Ordre de la mission non Télécharger', errors.message);
    });
  }

  onDownloadOrdre(): void {
    this.loading = true;
    this.dossierService.telechargerOrdreMission(Number(this.id$)).subscribe(
      (_data:any) => {
        // tu peux créer le blob comme pour onDownloadFrais si besoin d’auto-télécharger
        this.loading = false;
        this.hideLoadingModal();
        this.successmsg('Téléchargement de l\'ordre de mission réussi','Vérifiez vos téléchargements.');
      },
      (error: any) => {
        const errors = error?.error?.errors;
        if (errors?.length) {
          for (let i = 0; i < errors.length; i++) {
            const currentError = errors[i];
            this.toastService.error(currentError.champs + ': ' + currentError.message, 'Erreur!');
          }
        } else {
          this.toastService.error(error?.error?.message || 'Erreur lors du téléchargement', 'Erreur!');
        }
      }
    );
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

  hideLoadingModal() { Swal.close(); }

}

import { Component, OnInit } from '@angular/core';
import {DataStateEnum, ModelDataState} from "../../state/state";
import {BehaviorSubject, Observable, of} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, map, startWith} from "rxjs/operators";
import Swal from "sweetalert2";
import {Demande} from "../models/demande";
import {DemandeService} from "../services/demande.service";
import {PersonnelService} from "../services/personnel.service";
import {StatutDemandeService} from "../services/statut-demande.service";
import {Personnel} from "../models/personnel";
import {StatutDemande} from "../models/statut-demande";
import {TypeDemande} from "../models/type-demande";
import {TypeDemandeService} from "../services/type-demande.service";
import { UtilisateurService } from '../../utilisateur/services/utilisateur.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
// @ts-ignore
import Hashids from 'hashids'
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";

@Component({
  selector: 'app-demande',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.scss']
})
export class DemandeComponent implements OnInit {

  items: any[]=[];
  dataStateEnum = DataStateEnum
  state?: DataStateEnum
  dossiers?: Observable<ModelDataState<Demande[]>>
  listeDossierPage: Demande[] = []
  demande?: Demande
  listePersonnel: Personnel[] = []
  listeStatutDemande: StatutDemande[] = []
  listeTypeDemande: TypeDemande[] = []
  public nom:string = '';
  public searchValue: string = '';
  public loading:boolean=false;
  public id?:number;
  public idDemande?:number;

  pieces:File|undefined
  formulaireDossier = new FormGroup({
    id: new  FormControl(),
    dateDebut: new FormControl(new Date(), [Validators.required]),
    nbreJour: new FormControl('', [Validators.required]),
    motif: new FormControl(''),
    personnelId: new FormControl<number | null>(null, [Validators.required]),
    typeDemande: new FormControl(null, [Validators.required]),
  })
  totalDossier : number = 0;
  currentPage: number = 0;
  dossierPerPage: number = 10;
  sort: string = "desc";
  public pages: number[] = [];
  totalPages: number = 0;
  hashids : any
  devisSbj = new BehaviorSubject(0); // remove tab
  constructor(private dossierService: DemandeService,
              private personnelService:PersonnelService,
              private statutdemandeService:StatutDemandeService,
              private typedemandeService:TypeDemandeService,
              private utilisateurService: UtilisateurService,
              private httpClient: HttpClient,
              private toastService:ToastrService,
              private modalService:NgbModal) { } //générer les messages
  ngOnInit(): void {
    this.hashids = new Hashids('mysecretkey');
    registerLocaleData(localeFr, 'fr');
    this.items = [
      {label: 'Ressources Humaines'},
      {label: 'Demandes', active: true}
    ];
    this.chargerListeDemandePage();

      this.utilisateurService.personnelNonUtilisateur().subscribe(x => {
      this.listePersonnel = x;
    });
  }


  chargerListeDemandePage(): void {
    this.dossiers = this.dossierService
      .listerDemandePage(this.currentPage, this.dossierPerPage, this.sort)
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


  onSearchStatutDemande(nom: string){
    if(nom.length >= 3){
      this.statutdemandeService.rechercheStatutDemande(nom).subscribe(
        (response : any) => {
          this.listeStatutDemande = response.body.content
        },(error)=>{
        }
      );
    }
  }

  onSearchTypeDemande(nom: string){
    if(nom.length >= 3){
      this.typedemandeService.rechercheTypeDemande(nom).subscribe(
        (response : any) => {
          this.listeTypeDemande = response.body.content
        },(error)=>{
        }
      );
    }
  }

  // encodeId(id: number) {
  //   return this.hashids.encode(id);
  // }

   encodeId(id: number | undefined): string {
    if (id === undefined || id === null) {
      return this.hashids.encode(0); // ou une valeur par défaut
    }
    return this.hashids.encode(id);
  }

  openModal(content:any, dossier:Demande | undefined = undefined){
    if (dossier){
       this.formulaireDossier.patchValue(dossier as any)
      // this.formulaireDossier.get('personnelI').setValue(dossier?.personnel?.prenom.toString() + ' '+ dossier?.personnel?.nom.toString())
      // this.formulaireDossier.get('statutDemande').setValue(dossier?.statutDemande?.nom?.toString())
      // this.formulaireDossier.get('typeDemande').setValue(dossier?.typeDemande?.nom?.toString())
    }else{
      this.formulaireDossier.reset()
    }
     this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

  }


creeModifierDemande() {
  const formData = new FormData();
  
  // Ajouter le fichier (vérification de nullité)
  if (this.pieces) {
    formData.append('pieces', this.pieces);
  }

  // Vérifier et ajouter chaque champ avec des valeurs par défaut si nécessaire
  const dateDebutValue = this.formulaireDossier.get('dateDebut')?.value;
  if (dateDebutValue) {
    formData.append('dateDebut', dateDebutValue.toString());
  }

  const nbreJourValue = this.formulaireDossier.get('nbreJour')?.value;
  if (nbreJourValue !== null && nbreJourValue !== undefined) {
    formData.append('nbreJour', nbreJourValue.toString());
  }

  const motifValue = this.formulaireDossier.get('motif')?.value;
  if (motifValue) {
    formData.append('motif', motifValue.toString());
  }

  const personnelIdValue = this.formulaireDossier.get('personnelId')?.value;
  if (personnelIdValue !== null && personnelIdValue !== undefined) {
    formData.append('personnelId', personnelIdValue.toString());
  }

  const typeDemandeValue = this.formulaireDossier.get('typeDemande')?.value;
  if (typeDemandeValue !== null && typeDemandeValue !== undefined) {
    formData.append('typeDemande', typeDemandeValue);
  }

    if(this.formulaireDossier.valid)
      if(this.formulaireDossier.get('id')?.value){
        this.dossierService.modifierDemande(this.formulaireDossier.get("id")?.value, formData)
          .subscribe(
            (response:any)=>{
              this.listeDossierPage.map(e =>{
                if (e.id == response["data"].id){
                  e.dateDebut = response["data"].dateDebut
                  e.dateFin = response["data"].dateFin
                  e.commentaire = response["data"].commentaire
                  e.personnel = response["data"].personnel
                  e.statutDemande = response["data"].statutDemande
                  e.typeDemande = response["data"].typeDemande
                }
                return e;
              })
              this.modalService.dismissAll()
              this.chargerListeDemandePage()
              this.successmsg("Demande modifier", "La Demande a été modifié avec succès")
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
        this.dossierService.creerDemande(formData).subscribe(
          (response:any)=>{
            this.listeDossierPage.unshift(response['data'])
            this.formulaireDossier.reset()
            this.modalService.dismissAll()
            this.chargerListeDemandePage()
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

  uploaderFicher($event: any) {
    if($event.target.files.length > 0){
      this.pieces = $event.target.files[0];
    }
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  successmsg(title = 'Demande ajouter !', message = 'Vous venez d\'ajoutez avec succès une nouvelle Demande !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message:string) {
    Swal.fire(title, message, 'error');
  }

  supprimerDossier(id: number| undefined) {
  if (id === undefined || id === null) {
    this.errormsg('Erreur', 'ID non valide pour la suppression');
    return;
  }
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
        this.dossierService.supprimerDemande(id).subscribe({
          next: (value) => {
            this.devisSbj.next(0);
            this.listeDossierPage = this.listeDossierPage.filter(
              (i) => i.id !== id
            );
            this.successmsg('Suppression réussie', 'Demande supprimer');
          },
          error: (err) => {
            this.errormsg('Demande non supprimer', err.error.message);
          },
        });
      }
    });
  }


  telechargerFicheDemande(demande: number | undefined ) {
    const url = `${this.dossierService.contextPath}/telecharger/` + demande;

    
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
            catchError(this.handleError)  // Gérer les erreurs si nécessaire
          );
  }

   private handleError(error: any): Observable<any> {
      console.error('Une erreur s\'est produite:', error);
      throw new Error('Une erreur s\'est produite lors de la requête HTTP.');
    }

  showPopOnDownloadFicheDemande() {
    this.successmsg(
      'Ficher Demande telecharger',
      "Le Ficher de la Demande a été bien téléchargé avec succès"
    );
  }


  openModalDetailDemande(demande: Demande, content:any) {
    this.openModal(content);
    this.idDemande = demande.id;
    this.chargerDemandeId();
  }

  chargerDemandeId() {
    this.dossierService
      .voirDemande(this.idDemande!)
      .subscribe((response) => {
        this.demande = response
      });
  }


}

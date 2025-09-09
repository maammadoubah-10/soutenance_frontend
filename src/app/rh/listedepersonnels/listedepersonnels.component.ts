import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";

import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
// @ts-ignore  
import Hashids from 'hashids'
import {catchError, map, startWith} from "rxjs/operators";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import { ModeDePaiement } from '../models/mode-de-paiement';
import { StatutPersonnel } from '../models/statut-personnel';
import { DataStateEnum, ModelDataState } from '../../state/state';
import { civilite, Personnel, situationMatrimoniale } from '../models/personnel';
import { Poste } from '../models/poste';
import { Service } from '../models/service';
import { Banques } from '../models/banques';
import { Entites } from '../models/entites';
import { Indice } from '../models/indice';
import { PersonnelService } from '../services/personnel.service';
import { PosteService } from '../services/poste.service';
import { BanquesService } from '../services/banques.service';
import { IndiceService } from '../services/indice.service';
import { ModeDePaiementService } from '../services/mode-de-paiement.service';
import { StatutPersonnelService } from '../services/statut-personnel.service';
import { EntitesService } from '../services/entites.service';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'app-listedepersonnels',
  templateUrl: './listedepersonnels.component.html',
  styleUrls: ['./listedepersonnels.component.scss'] 
})
export class ListedepersonnelsComponent implements OnInit {

  //@ViewChild(NgWizardComponent) //formulaire avec des étapes 1 2 3 4
  //public wizard!: NgWizardComponent;


  items: any[] = [];
  dataStateEnum = DataStateEnum
  state?: DataStateEnum
  dossiers?: Observable<ModelDataState<Personnel[]>> //pour afficher au niveau de l'écran (fossier reçois la requete)
  listeDossierPage: Personnel[] = [] //listePersonnelPage
  listePoste: Poste[] = []
  listeService: Service[] = []
  listeBanque: Banques [] = []
  listeEntite: Entites [] = []
  listeIndice: Indice [] = []
  listeModeDePaiement: ModeDePaiement [] = []
  listeStatutPersonnel: StatutPersonnel [] = []
  public typeCivilites = Object.values(civilite); //definir les enums // voir le swagger pour voir comment s'est écrit
  public situationMatrimoniales = Object.values(situationMatrimoniale); //definir les enums // voir le swagger pour voir comment s'est écrit
  // Définir une expression régulière pour les numéros de téléphone valides
  PHONE_REGEX = /^[+]?[(]?[0-9]{1,6}[)]?[-\s.]?[0-9]{3,6}[-\s.]?[0-9]{3,6}$/; //pattern du téléphone
  public nom:string = '';
  public matricule:string = '';
  public prenom: string ='';
  public searchValue: string = '';
  public loading:boolean=false;
  public id:number=0;
  public designation:string = '';
  public sigle:string = '';

  formulaireDossier = new FormGroup({
    id: new  FormControl(),
    identitePersonnelGroupe: this.formBuilder.group({
      matricule: new FormControl('', [Validators.required]),
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      civilite: new FormControl('', [Validators.required]),
      dateDeNaissance: new FormControl('', [Validators.required]),
      referenceComptable: new FormControl(''),
      situationMatrimoniale: new FormControl(''),
      statutPersonnel: new FormControl<string | null>(null, [Validators.required]), // ← Permettre string | null
      nombreEnfant: new FormControl('', [Validators.required]),
      pieceIdentite: new FormControl(''),
      numeroCnss: new FormControl(''),
      telephone: new FormControl('', [ Validators.pattern(this.PHONE_REGEX)]),
      dateEmbauchage: new FormControl('', [Validators.required]),
      adresse: new FormControl(''),
    }),

    personneContacterGroupe:  this.formBuilder.group({
      telephoneContact: new FormControl('', [Validators.pattern(this.PHONE_REGEX)]),
      prenomContact: new FormControl(''),
      nomContact: new FormControl(''),
    }),

    identiteBanquePersonneGroupe: this.formBuilder.group({
      banque: new FormControl<string | null>(null),
      cleRib: new FormControl('', [ Validators.minLength(2), Validators.maxLength(2)]),
      codeBanque: new FormControl('', [ Validators.minLength(5), Validators.maxLength(5)]),
      codeGuichet: new FormControl('', [ Validators.minLength(5), Validators.maxLength(5)]),
      numeroCompte: new FormControl(''),
      modePaiement: new FormControl<string | null>(null),

    }),

    autrePersonnelGroupe: this.formBuilder.group({
      poste: new FormControl<string | null>(null, [Validators.required]),
      entite: new FormControl<string | null>(null, [Validators.required]),
      indice: new FormControl<string | null>(null),
    }),
  })

  totalDossier : number = 0;
  currentPage: number = 0;
  dossierPerPage: number = 8;
  breadCrumbItems: Array<{ label: string; active?: boolean }> = [];
  sort: string = "desc";
  public pages: number[] = [];
  totalPages: number = 0;
  hashids : any
  devisSbj = new BehaviorSubject(0); // remove tab
  constructor(private dossierService: PersonnelService, //j'appelle tous les service que je veux utiliser qui sont dans le model du controller
              private posteService: PosteService,
              private router:Router,
              private banqueService: BanquesService,
              private entiteService: EntitesService,
              private toastService:ToastrService,
              private indiceService: IndiceService,
             // private ngWizardService: NgWizardService, // faire formulaire à étape
              private formBuilder: FormBuilder, // pour grouper les ligne du formulaire
              private modeDePaiementService: ModeDePaiementService,
              private statutPersonnelService: StatutPersonnelService,
              private modalService:NgbModal) { } //générer les messages
  ngOnInit(): void {
    this.hashids = new Hashids('mysecretkey');

    //this.breadCrumbItems = [
//   { label: 'Forms' }, 
//   { label: 'Form Wizard', active: true }
// ];
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Form Wizard', active: true }];
    this.items = [
      {label: 'Ressources Humaines'},
      {label: 'Liste du personnel', active: true}
    ];
    this.chargerListePersonnelPage();
  }

  onSearchPoste(designation: string){
    if(designation.length >= 3){
      this.posteService.recherchePoste(designation).subscribe(
        (response : any) => {
          this.listePoste = response.body.content
        },(error)=>{
        }
      );
    }
  }


onNext(stepper: MatStepper): void {
  stepper.next(); 
}


  onSearchBanque(sigle: string){
    if(sigle.length >= 1){
      this.banqueService.rechercheBanque(sigle).subscribe(
        (response : any) => {
          this.listeBanque = response.body.content
        },(error)=>{
        }
      );
    }
  }
  onSearchEntite(designation: string){
    if(designation.length >= 3){
      this.entiteService.rechercheEntite(designation).subscribe(
        (response : any) => {
          this.listeEntite = response.body.content
        },(error)=>{
        }
      );
    }
  }
  onSearchIndice(nom: string){
    if(nom.length >= 3){
      this.indiceService.rechercheIndice(nom).subscribe(
        (response : any) => {
          this.listeIndice = response.body.content
        },(error)=>{
        }
      );
    }
  }
  onSearchModeDePaiement(designation: string){
    if(designation.length >= 3){
      this.modeDePaiementService.rechercheModeDePaiement(designation).subscribe(
        (response : any) => {
          this.listeModeDePaiement = response.body.content
        },(error)=>{
        }
      );
    }
  }
  onSearchStatutPersonnel(designation: string){
    if(designation.length >= 3){
      this.statutPersonnelService.rechercheStatutPersonnel(designation).subscribe(
        (response : any) => {
          this.listeStatutPersonnel = response.body.content
        },(error)=>{
        }
      );
    }
  }

  chargerListePersonnelPage(): void {
    this.dossiers = this.dossierService
      .listerPersonnelPage(this.currentPage, this.dossierPerPage, this.sort)
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


  closeModal() {
    this.modalService.dismissAll()
  }

  successmsg(title = 'personnel ajouté !', message = 'Vous venez d\'ajoutez avec succès un nouveau personnel !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message:string) {
    Swal.fire(title, message, 'error');
  }



  handleClick() {
    if (!this.nom && !this.matricule && !this.prenom) {
      this.chargerListePersonnelPage();
    }else if(this.nom) {
      this.searchNom()
    }else if(this.prenom) {
      this.searchPrenom()
    }else if(this.matricule) {
      this.searchMatricule()
    }
  }

  searchNom(): void { //fonction de recherche
    this.dossiers =  this.dossierService.recherchePersonnelNomPage(this.nom, this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeDossierPage = response.body.content;
          if (this.listeDossierPage.length === 0) {
            this.errormsg('Erreur', 'Aucun enregistrement ne correspond à votre recherche');
            this.chargerListePersonnelPage()
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

  onPageChangenom(event: any): void { //actionne la recherche
    this.currentPage = 0;
    this.dossierPerPage = 8;
    if (this.nom && this.nom?.length >= 3) {
      this.searchNom();
      if (this.listeDossierPage.length === 0) {
        throw new Error('Aucun résultat trouvé pour la recherche.');
        this.errormsg('Erreur', 'Aucun résultat ne correspond à votre recherche');
      }
    } else if (!this.nom?.length) {
      this.chargerListePersonnelPage();
    }
  }


  searchPrenom(): void { //fonction de recherche
    this.dossiers =  this.dossierService.recherchePersonnelPrenom(this.prenom, this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeDossierPage = response.body.content;
          if (this.listeDossierPage.length === 0) {
            this.errormsg('Erreur', 'Aucun enregistrement ne correspond à votre recherche');
            this.chargerListePersonnelPage()
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

  onPageChangePrenom(event: any): void { //actionne la recherche
    this.currentPage = 0;
    this.dossierPerPage = 8;
    if (this.prenom && this.prenom?.length >= 3) {
      this.searchPrenom();
      if (this.listeDossierPage.length === 0) {
        throw new Error('Aucun résultat trouvé pour la recherche.');
        this.errormsg('Erreur', 'Aucun résultat ne correspond à votre recherche');
      }
    } else if (!this.prenom?.length) {
      this.chargerListePersonnelPage();
    }
  }


  searchMatricule(): void { //fonction de recherche
    this.dossiers =  this.dossierService.recherchePersonnelMatricule(this.matricule, this.currentPage, this.dossierPerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeDossierPage = response.body.content;
          if (this.listeDossierPage.length === 0) {
            this.errormsg('Erreur', 'Aucun enregistrement ne correspond à votre recherche');
            this.chargerListePersonnelPage()
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

  onPageChangeMatricule(event: any): void { //actionne la recherche
    this.currentPage = 0;
    this.dossierPerPage = 8;
    if (this.matricule && this.matricule?.length >= 3) {
      this.searchMatricule();
      if (this.listeDossierPage.length === 0) {
        throw new Error('Aucun résultat trouvé pour la recherche.');
        this.errormsg('Erreur', 'Aucun résultat ne correspond à votre recherche');
      }
    } else if (!this.matricule?.length) {
      this.chargerListePersonnelPage();
    }
  }


  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  get formPersonnel(){
    return this.formulaireDossier.controls;
  }

  encodeId(id: number) {
    return this.hashids.encode(id);
  }

  openModal(content:any, dossier:Personnel | undefined = undefined){
    if (dossier){ //modification des donnéées
      this.formulaireDossier.patchValue(dossier as any)
      this.formulaireDossier.get('id')?.setValue(dossier?.id)
      this.formPersonnel.identitePersonnelGroupe['controls'].matricule.setValue(dossier?.matricule?.toString())
      this.formPersonnel.identitePersonnelGroupe['controls'].nom.setValue(dossier?.nom?.toString())
      this.formPersonnel.identitePersonnelGroupe['controls'].prenom.setValue(dossier?.prenom?.toString())
      this.formPersonnel.identitePersonnelGroupe['controls'].civilite.setValue(dossier?.civilite?.toString())
      this.formPersonnel.identitePersonnelGroupe['controls'].dateDeNaissance.setValue(dossier?.dateDeNaissance?.toString())
      this.formPersonnel.identitePersonnelGroupe['controls'].referenceComptable.setValue(dossier?.referenceComptable?.toString())
      this.formPersonnel.identitePersonnelGroupe['controls'].situationMatrimoniale.setValue(dossier?.situationMatrimoniale?.toString())
      this.formPersonnel.identitePersonnelGroupe['controls'].statutPersonnel.setValue(dossier?.statutPersonnel?.designation?.toString())
      this.formPersonnel.identitePersonnelGroupe['controls'].nombreEnfant.setValue(dossier?.nombreEnfant?.toString())
      this.formPersonnel.identitePersonnelGroupe['controls'].pieceIdentite.setValue(dossier?.pieceIdentite?.toString())
      this.formPersonnel.identitePersonnelGroupe['controls'].numeroCnss.setValue(dossier?.numeroCnss?.toString())
      this.formPersonnel.identitePersonnelGroupe['controls'].telephone.setValue(dossier?.telephone?.toString())
      this.formPersonnel.identitePersonnelGroupe['controls'].dateEmbauchage.setValue(dossier?.dateEmbauchage?.toString())
      this.formPersonnel.identitePersonnelGroupe['controls'].adresse.setValue(dossier?.adresse?.toString())

      this.formPersonnel.personneContacterGroupe['controls'].telephoneContact.setValue(dossier?.telephoneContact?.toString())
      this.formPersonnel.personneContacterGroupe['controls'].prenomContact.setValue(dossier?.prenomContact?.toString())
      this.formPersonnel.personneContacterGroupe['controls'].nomContact.setValue(dossier?.nomContact?.toString())

      this.formPersonnel.identiteBanquePersonneGroupe['controls'].banque.setValue(dossier?.banque?.designation?.toString())
      this.formPersonnel.identiteBanquePersonneGroupe['controls'].cleRib.setValue(dossier?.cleRib?.toString())
      this.formPersonnel.identiteBanquePersonneGroupe['controls'].codeBanque.setValue(dossier?.codeBanque?.toString())
      this.formPersonnel.identiteBanquePersonneGroupe['controls'].codeGuichet.setValue(dossier?.codeGuichet?.toString())
      this.formPersonnel.identiteBanquePersonneGroupe['controls'].numeroCompte.setValue(dossier?.numeroCompte?.toString())
      this.formPersonnel.identiteBanquePersonneGroupe['controls'].modePaiement.setValue(dossier?.modePaiement?.designation?.toString())

      this.formPersonnel.autrePersonnelGroupe['controls'].poste.setValue(dossier?.poste?.designation?.toString())
      this.formPersonnel.autrePersonnelGroupe['controls'].entite.setValue(dossier?.entite?.designation?.toString())
      this.formPersonnel.autrePersonnelGroupe['controls'].indice.setValue(dossier?.indice?.nom?.toString())
    }else{ // lors de la création il rafraichit à chaque niveau
      this.formulaireDossier.reset()
      this.formPersonnel.id.reset()
      this.formPersonnel.identitePersonnelGroupe.reset()
      this.formPersonnel.personneContacterGroupe.reset()
      this.formPersonnel.identiteBanquePersonneGroupe.reset()
      this.formPersonnel.autrePersonnelGroupe.reset()

      this.formPersonnel.identitePersonnelGroupe['controls'].civilite.setValue(null)
      this.formPersonnel.identitePersonnelGroupe['controls'].situationMatrimoniale.setValue(null)
      this.formPersonnel.identitePersonnelGroupe['controls'].statutPersonnel.setValue(null)

      this.formPersonnel.identiteBanquePersonneGroupe['controls'].banque.setValue(null)

      this.formPersonnel.autrePersonnelGroupe['controls'].poste.setValue(null)
      this.formPersonnel.autrePersonnelGroupe['controls'].entite.setValue(null)
      this.formPersonnel.autrePersonnelGroupe['controls'].indice.setValue(null)
    }
    this.modalService.open(content, { size: 'lg', centered: true });
  }


  creerModifierPersonnel() {
    let formDataPersonnel = null;
    if (this.formulaireDossier.valid) {
      formDataPersonnel = {
        "matricule": this.formPersonnel.identitePersonnelGroupe['controls'].matricule.value || null,
        "nom": this.formPersonnel.identitePersonnelGroupe['controls'].nom.value || null,
        "prenom": this.formPersonnel.identitePersonnelGroupe['controls'].prenom.value || null,
        "civilite": this.formPersonnel.identitePersonnelGroupe['controls'].civilite.value || null,
        "dateDeNaissance": this.formPersonnel.identitePersonnelGroupe['controls'].dateDeNaissance.value || null,
        "referenceComptable": this.formPersonnel.identitePersonnelGroupe['controls'].referenceComptable.value || null,
        "situationMatrimoniale": this.formPersonnel.identitePersonnelGroupe['controls'].situationMatrimoniale.value || null,
        "statutPersonnel": this.formPersonnel.identitePersonnelGroupe['controls'].statutPersonnel.value || null,
        "nombreEnfant": this.formPersonnel.identitePersonnelGroupe['controls'].nombreEnfant.value || null,
        "pieceIdentite": this.formPersonnel.identitePersonnelGroupe['controls'].pieceIdentite.value || null,
        "numeroCnss": this.formPersonnel.identitePersonnelGroupe['controls'].numeroCnss.value || null,
        "telephone": this.formPersonnel.identitePersonnelGroupe['controls'].telephone.value || null,
        "dateEmbauchage": this.formPersonnel.identitePersonnelGroupe['controls'].dateEmbauchage.value,
        "adresse": this.formPersonnel.identitePersonnelGroupe['controls'].adresse.value || null,

        "telephoneContact": this.formPersonnel.personneContacterGroupe['controls'].telephoneContact.value || null,
        "prenomContact": this.formPersonnel.personneContacterGroupe['controls'].prenomContact.value || null,
        "nomContact": this.formPersonnel.personneContacterGroupe['controls'].nomContact.value || null,

        "banque": this.formPersonnel.identiteBanquePersonneGroupe['controls'].banque.value || null,
        "cleRib": this.formPersonnel.identiteBanquePersonneGroupe['controls'].cleRib.value || null,
        "codeBanque": this.formPersonnel.identiteBanquePersonneGroupe['controls'].codeBanque.value || null,
        "codeGuichet": this.formPersonnel.identiteBanquePersonneGroupe['controls'].codeGuichet.value || null,
        "numeroCompte": this.formPersonnel.identiteBanquePersonneGroupe['controls'].numeroCompte.value || null,
        "modePaiement": this.formPersonnel.identiteBanquePersonneGroupe['controls'].modePaiement.value || null,

        "poste": this.formPersonnel.autrePersonnelGroupe['controls'].poste.value || null,
        "entite": this.formPersonnel.autrePersonnelGroupe['controls'].entite.value || null,
        "indice": this.formPersonnel.autrePersonnelGroupe['controls'].indice.value || null,
      };
    }

    if (this.formulaireDossier.get('id')?.value) {
      this.dossierService.modifierPersonnel(this.formulaireDossier.get('id')?.value, formDataPersonnel)
        .subscribe(
          (response:any) => {
            alert('3');

            this.listeDossierPage = this.listeDossierPage.map(e => {
              if (e.id === response["data.data"].id) {
                e = {
                  ...e,
                  matricule: response["data.data"].matricule,
                  nom: response["data.data"].nom,
                  prenom: response["data.data"].prenom,
                  civilite: response["data"].civilite,
                  dateDeNaissance: response["data"].dateDeNaissance,
                  referenceComptable: response["data"].referenceComptable,
                  situationMatrimoniale: response["data"].situationMatrimoniale,
                  statutPersonnel: response["data"].statutPersonnel.id,
                  nombreEnfant: response["data"].nombreEnfant,
                  pieceIdentite: response["data"].pieceIdentite,
                  numeroCnss: response["data"].numeroCnss,
                  telephone: response["data"].telephone,
                  dateEmbauchage: response["data"].dateEmbauchage,
                  adresse: response["data"].adresse,
                  telephoneContact: response["data"].telephoneContact,
                  prenomContact: response["data"].prenomContact,
                  nomContact: response["data"].nomContact,
                  banque: response["data"].banque.id,
                  cleRib: response["data"].cleRib,
                  codeBanque: response["data"].codeBanque,
                  codeGuichet: response["data"].codeGuichet,
                  numeroCompte: response["data"].numeroCompte,
                  modePaiement: response["data"].modePaiement.id,
                  poste: response["data"].poste.id,
                  entite: response["data"].entite.id,
                  indice: response["data"].indice.id
                };
              }
              return e;
            });
            this.modalService.dismissAll();
            this.chargerListePersonnelPage()
            this.successmsg("Personnel modifié", "Le Personnel a été modifié avec succès");
            this.formulaireDossier.reset();
          },
          (error) => {
            this.errormsg('Erreur', error.error.message);
            for (let erreur in error.error.errors) {
              this.errormsg('Erreur', erreur + " " + error.error.errors[erreur]);
            }
          }
        );
    } else {
      this.dossierService.creerPersonnel(formDataPersonnel).subscribe(
        (response:any) => {
          this.listeDossierPage.unshift(response['data']);
          this.modalService.dismissAll();
          this.chargerListePersonnelPage();
          this.successmsg('Personnel créé', 'Vous avez créé avec succès un nouveau personnel');
          this.formulaireDossier.reset();

        },
        (error) => {
          this.errormsg('Erreur', error.error.message);
          for (let erreur in error.error.errors) {
            this.errormsg('Erreur', erreur + " " + error.error.errors[erreur]);
          }
        }
      );
    }
  }


  supprimerPersonnel(id: number) {
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
        this.dossierService.supprimerPersonnel(id).subscribe({
          next: (value:any) => {
            this.devisSbj.next(0);
            this.listeDossierPage = this.listeDossierPage.filter(
              (i) => i.id !== id
            );
            this.successmsg('Personnel supprimer', 'Suppression réussie');
          },
          error: (err) => {
            this.errormsg('Personnel non supprimer', err.error.message);
          },
        });
      }
    });
  }


  retraitePersonnelGroupe() {
    Swal.fire({
      title: 'Êtes vous sûr ?',
      text: 'Êtes vous sûr de vouloir mettre en retraite tout les personnels dont le temps de service est egale à 30 ans. Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Mettez les en retraite!',
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.value) {
        this.dossierService.retraitePersonnelEnGroupe().subscribe({
          next: (value:any) => {
            this.successmsg('Personnels misent en  retraite', 'Mise en retraite réussie');
          },
          error: (err) => {
            this.errormsg('Personnels non misent en  retraite', err.error.message);
          },
        });
      }
    });
  }


}

import { Component, OnInit } from '@angular/core';
import {DataStateEnum, ModelDataState} from "../../../state/state";
import {Contrat} from "../../models/contrat";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Client} from "../../models/client";
import {Typecontrat} from "../../models/typecontrat";
import {FormControl, FormGroup, Validators} from "@angular/forms";
// @ts-ignore
import Hashids from 'hashids'
import {ContratService} from "../../services/contrat.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ClientService} from "../../services/client.service";
import {TypecontratService} from "../../services/typecontrat.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {catchError, map, startWith} from "rxjs/operators";
import Swal from "sweetalert2";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import {Service} from "../../models/service";
import {DistributeurService} from "../../services/distributeur.service";
import {ParrainService} from "../../services/parrain.service";
import {TypeabonnementService} from "../../services/typeabonnement.service";
import {TypefacturespecService} from "../../services/typefacturespec.service";
import {TypejournalService} from "../../services/typejournal.service";
import {Distributeur} from "../../models/distributeur";
import {Parrain} from "../../models/parrain";
import {Typeabonnement} from "../../models/typeabonnement";
import {Typefacturespec} from "../../models/typefacturespec";
import {Typejournal} from "../../models/typejournal";
import {AbonnementService} from "../../services/abonnement.service";
import {Abonnement} from "../../models/abonnement";
import {ProductDetailService} from "../../services/product-detail.service";
import {ProduitService} from "../../services/produit.service";
import {Detailproduit} from "../../models/detailproduit";
import {Produit} from "../../models/produit";
import {Typeclient} from "../../models/typeclient";
import {TypeclientService} from "../../services/typeclient.service";
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {Statistiques} from "../../models/statistiques";
import {Groupetaxation} from "../../models/groupetaxation";
import {GroupetaxationService} from "../../services/groupetaxation.service";
import {Devis} from "../../models/devis";
import {Avenant} from "../../models/avenant";
import {Plainte} from "../../models/plainte";
import {PlainteService} from "../../services/plainte.service";
import {Typerelance} from "../../models/typerelance";
import {TyperelanceService} from "../../services/typerelance.service";

@Component({
  selector: 'app-detailcontrat',
  templateUrl: './detailcontrat.component.html',
  styleUrls: ['./detailcontrat.component.scss']
})
export class DetailcontratComponent implements OnInit {
  items: Array<{}>;
  dataStateEnum = DataStateEnum
  state: DataStateEnum
  contrat:Contrat
  contra:Contrat
  service:Service
  statistiques:Statistiques
  progresse:Statistiques
  devisSbj = new BehaviorSubject(0);
  contrats: Observable<ModelDataState<Contrat[]>>
  abonnements: Observable<ModelDataState<Abonnement[]>>
  contrat$: Observable<ModelDataState<Contrat | undefined>>;
  listeContrat: Contrat[] = []
  listeAvenant: Avenant[] = []
  listeTypeRelance: Typerelance[] = []
  listeabonnement: Abonnement[] = []
  listeServicebonnement: Abonnement[] = []
  listeServiceDevis: Devis[] = []
  listeService: Service[] = []
  listeInsertionPage: Contrat[] = []
  listeclient: Client[] = []
  listeTypeContrat: Typecontrat[] = []
  listedistributeur: Distributeur[] = []
  listeparrain: Parrain[] = []
  typesClient: Typeclient[] = [];
  listeTypeAbonnement: Typeabonnement[] = []
  listeTypeJournal: Typejournal[] = [];
  listeSousTypeJournal: Typejournal[] = [];
  productDetails: Detailproduit[] = [];
  listeProduitFiltre: Produit[] = [];
  listeGroupe: Groupetaxation[] = []
  products: Produit[] = [];
  plaintes: Observable<ModelDataState<Plainte[]>>
  listePlainte: Plainte[] = []
  plainte: Plainte;
  public idPlainte:number;
  public designation:string;
  public searchValue: string = '';
  public searchItem: string = ""
  public searchItemDistributeur: string = ""
  public loading:boolean=false;
  public id:number;
  public perPage:number = 4;
  public perPagePlainte:number = 2;
  public p: number = 1;
  public client: number;
  fichier_contrat:File|undefined
  formulaireContrat = new FormGroup({
    id: new FormControl(''),
    client: new FormControl(null, [Validators.required, Validators.pattern("^[1-9]\\d*$")]),
    dateDebut: new FormControl(new Date(), [Validators.required]),
    dateFin: new FormControl(new Date(), [Validators.required]),
    montant: new FormControl('', [Validators.required, Validators.pattern("^[1-9]\\d*$")]),
    nom: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    numero: new FormControl('', [Validators.required]),
    typeContrat: new FormControl('', [Validators.required])
  });

  fichier_avenant: File| undefined
  formulaireAvenant = new FormGroup({
    id: new FormControl(''),
    description: new FormControl(''),
  });


  formulairePlainteInsertion = new FormGroup({
    id: new  FormControl(),
    motif: new FormControl('',[Validators.required]),
    description: new FormControl(new Date(),[Validators.required]),
    type_relance_id: new FormControl('',[Validators.required]),
  })



  formulaireServiceAbonnement = new FormGroup({
    abonnement_dto: new FormGroup({
      id: new  FormControl(),
      bon_commande: new FormControl(false),
      contrat: new FormControl(true),
      paiement_comptant: new FormControl(false),
      distributeur: new FormControl('',[Validators.required]),
      parrain: new FormControl('', [Validators.required]),
      type_abonnement_id: new FormControl('', [Validators.required]),
      type_journal_id: new FormControl('', [Validators.required]),
      titre_lettre: new FormControl('', [Validators.required]),
      souscription: new FormGroup({
        type_client_id: new FormControl(3),
        produit: new FormControl('', [Validators.required]),
        detail_produit: new FormControl('', [Validators.required]),
        taux_remise: new FormControl(0),
        nombre_journaux: new FormControl('', [Validators.required]),
      }),
    }),
    type_contrat_id: new FormControl()
  });

  fiche_bon_commande:File|undefined
  formulaireServiceInsertion = new FormGroup({
    devis_dto: new FormGroup({
      id: new  FormControl(),
      bon_commande: new FormControl(false),
      contrat: new FormControl(true),
      paiement_comptant: new FormControl(false),
      groupe_taxation: new FormControl('',[Validators.required]),
    }),
    type_contrat_id: new FormControl()
  });

  hashids : any
  private id$: any;
  constructor(private contratService: ContratService,
              private router:Router,
              private abonnementService: AbonnementService,
              private typerelanceService : TyperelanceService,
              private productDetailsSvc: ProductDetailService,
              private plainteService: PlainteService,
              private productsSvc: ProduitService,
              private clientService : ClientService,
              private distributeurService : DistributeurService,
              private parrainService : ParrainService,
              private typeClientSvc: TypeclientService,
              private typeabonnementService : TypeabonnementService,
              private groupetaxationService: GroupetaxationService,
              private typejournalService : TypejournalService,
              private typecontratService : TypecontratService,
              private activatedRoute:ActivatedRoute,
              private modalService:NgbModal,
              private toastService:ToastrService) { }


  ngOnInit(): void {
    this.hashids = new Hashids('mysecretkey');
    registerLocaleData(localeFr, 'fr');
    this.activatedRoute.paramMap.subscribe(params => {
      const encodedId = params.get('id');
      this.id$ = this.decodeId(encodedId);
    });
    this.items = [
      {label: 'Commercial'},
      {label: 'Contrat'},
      {label: 'Détail', active: true}
    ];
    this.chargerIdContrat(this.id$)
    this.chargerListeClient();
    this.chargerListeTypeContrat()
    this.chargerlisteTypeRelance();
    this.loadTypesClient();
    this.chargerlisteparrain();
    this.chargerlisteTypeAbonnement();
    this.chargerlisteTypeJournal();
    this.chargerSouslisteTypeJournal();
    this.loadProducts();
    this.chargerListeGroupetaxation()
    this.loadStartistique();
    this.chargerPlainteInsertion()
    this.formulaireServiceAbonnement.controls.abonnement_dto.controls.souscription.controls.produit.valueChanges.subscribe(
      (value) => {
        if (value)
          this.productsSvc.listeDetailProduit(+value).subscribe(
            (response) => {
              this.productDetails = response.data;
            },
            (error) => {
              this.toastService.error(error, 'Erreur');
            }
          );
      }
    );
  }

  decodeId(encodedId: string) {
    const [id] = this.hashids.decode(encodedId);
    return id;
  }

  chargerlisteTypeRelance() {
    this.typerelanceService.listeTypeRelance().subscribe(
      (response)=>{
        this.listeTypeRelance = response.data
      }
    )
  }


  onSearch(serachterm : string){
    if(serachterm.length >= 3){
      this.clientService.listeClientSearchTriee(serachterm).subscribe(
        (response : any) => {
          this.listeclient = response['content']
        },(error)=>{
        }
      );
    }
  }


  loadTypesClient() {
    this.typeClientSvc.listeTypeClient().subscribe((response) => {
      this.typesClient = response.data;
    });
  }

  chargerListeGroupetaxation(){
    this.groupetaxationService.listeGroupeTaxation().subscribe(
      (response)=>{
        this.listeGroupe = response.data
      }
    )
  }

  loadStartistique() {
    this.contratService.statistique(this.id$).subscribe((response) => {
      this.statistiques = response.data;
    });
    this.contratService.progressionDePaiement(this.id$).subscribe((response) => {
      this.progresse = response;
    });
  }

  loadProducts() {
    this.productsSvc.listeProduit().subscribe((result) => {
        this.products = result.data;
        this.listeProduitFiltre = this.products.filter(
          (produit) => produit.famille.id == 3 && produit.designation != 'Vente de Journaux'
        );
      },
      (error) => {
        this.toastService.error(error, 'Erreur');
      }
    );
  }


  chargerlisteparrain() {
    this.parrainService.listeParrain().subscribe(
      (response)=>{
        this.listeparrain = response.data
      }
    )
  }
  chargerlisteTypeAbonnement() {
    this.typeabonnementService.listeTypeabonnement().subscribe(
      (response)=>{
        this.listeTypeAbonnement = response.data
      }
    )
  }

  chargerlisteTypeJournal() {
    this.typejournalService.listeTypeJournal().subscribe((response) => {
      this.listeTypeJournal = response.data.filter(
        typeJournal => typeJournal.designation !== 'STAGIAIRE'
          && typeJournal.designation !== 'RETRAITÉS'
          && typeJournal.designation !== 'GRATUIT'
          && typeJournal.designation !== 'APPRENTIS'
          && typeJournal.designation !== 'PERSONNEL'
          && typeJournal.designation !== 'CONSEIL D\'ADMINISTRATION'
      );
    });
  }

  chargerSouslisteTypeJournal() {
    this.typejournalService.listeTypeJournal().subscribe((response) => {
      this.listeSousTypeJournal = response.data.filter(typeJournal => typeJournal.designation === 'STAGIAIRE'
        || typeJournal.designation === 'RETRAITÉS'
        || typeJournal.designation === 'PERSONNEL'
        || typeJournal.designation === 'APPRENTIS'
        || typeJournal.designation === 'CONSEIL D\'ADMINISTRATION');
    });
  }




  chargerIdContrat(id) {
    this.activatedRoute.params.subscribe(params => {
      this.chargeInformationContrat(id)
    })
  }

  chargeInformationContrat(id: number) {
    this.contrat$ = this.contratService
      .voirContrat(id)
      .pipe(
        map((e) => {
          this.contrat = e.data;
          this.chargerListeServiceContrat()
          this.chargerListeAvenantContrat()
          return { dataState: DataStateEnum.CHARGE, data: e };
        }),
        startWith({ dataState: DataStateEnum.CHARGEMENT })
      )
      .pipe(
        catchError((err) => {
          return of({ dataState: this.dataStateEnum.CHARGE, data: undefined });
        })
      );
  }

  chargerListeClient() {
    this.clientService.listeClient().subscribe(
      (response)=>{
        this.listeclient = response.data
      }
    )
  }

  chargerListeTypeContrat() {
    this.typecontratService.listeTypeContrat().subscribe(
      (response)=>{
        this.listeTypeContrat = response.data
      }
    )
  }

  onSearchDistributaire(searchItemDistributeur : string){
    if(searchItemDistributeur.length >= 3){
      this.distributeurService.rechercheDistributeur(searchItemDistributeur).subscribe(
        (response : any) => {
          this.listedistributeur = response
        },(error)=>{
        }
      );
    }
  }


  encodeId(id: number) {
    return this.hashids.encode(id);
  }


  closeModal() {
    this.modalService.dismissAll()
  }

  successmsg(title = 'Contrat ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau contrat !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message) {
    Swal.fire(title, message, 'error');
  }

  openModal(content:any, contrat:Contrat | undefined = undefined){
    if (contrat){
      this.formulaireContrat.get("client").setValue(contrat?.client?.id.toString())
      this.formulaireContrat.get('typeContrat').setValue(contrat?.type_contrat?.id.toString())
    }
    this.modalService.open(content)
  }



  creerModifierContrat(){
    if(this.formulaireContrat.valid )
    {
      if(this.formulaireContrat.get('id').value){
        this.modifierContrat()
      }
    }
  }

  async modifierContrat() {
    const contratId = this.formulaireContrat.get('id').value;
    const contra = await this.contratService.voirContrat(this.id$).toPromise();
    const formData = new FormData();
    formData.append('id', contra.id.toString());
    formData.append('client', this.formulaireContrat.get('client').value || contra.client.id);
    formData.append('dateDebut', this.formulaireContrat.get('dateDebut').value || contra.date_debut);
    formData.append('dateFin', this.formulaireContrat.get('dateFin').value || contra.date_fin);
    formData.append('montant', this.formulaireContrat.get('montant').value || contra.montant);
    formData.append('nom', this.formulaireContrat.get('nom').value || contra.nom);
    formData.append('numero', this.formulaireContrat.get('numero').value || contra.numero);
    formData.append('typeContrat', this.formulaireContrat.get('typeContrat').value || contra.typeContrat);
    if (this.fichier_contrat) {
      formData.append('fichier_contrat', this.fichier_contrat as File);
    }
    if (this.formulaireContrat.valid) {
      this.contratService.modifierContrat(formData).subscribe(
        (response) => {
          this.listeContrat = this.listeContrat.map(i => i.id !== response.data.id ? i : response.data);
          this.modalService.dismissAll();
          this.successmsg("Contrat modifié", "Le contrat a été modifié avec succès");
        },
        (error) => {
        }
      );
    }
  }

  uploaderFicher($event: any) {
    if($event.target.files.length > 0){
      this.fichier_contrat = $event.target.files[0];
    }
  }

  supprimerContrat() {
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
        this.contratService.supprimerContrat(this.id$).subscribe({
          next: (value) => {
            this.devisSbj.next(0);
            this.listeContrat = this.listeContrat.filter(
              (i) => i.id !== this.id$
            );
            this.router.navigate(['/commercial/contrat'])
            this.toastService.success('Suppression réussie', 'Contrat supprimer');
          },
          error: (err) => {
            this.toastService.error(err.error.message, 'Contrat non supprimer');
            this.errormsg('Contrat non supprimer', err.error.message);
          },
        });
      }
    });
  }

  validerContrat() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir le valider? Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Valider le !',
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.validation();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // handle cancel action if necessary
      }
    }).catch((error) => {
    });
  }

  validation(){
    this.contratService.validerContrat(this.id$)
      .subscribe({
        next: _ => {
          this.listeContrat.map(e =>{
            if (e.id == this.id$){
              e.statut = 'EN_COURS'
            }
            return e;
          } )
          this.closeModal()
          this.chargerIdContrat(this.id$)
          this.successmsg("Contrat Validé", "Le contrat a été validé avec succès")
        },
        error: error => {
          this.closeModal()
          this.errormsg("Contrat non Validé", error.error.message)
          this.loading = false
        }
      })
  }

  telechargerFichierContrat(contrat:Contrat) {
    return this.contratService.contextPath+ 'fichiers/telecharger/FICHE_CONTRAT/'+contrat.fichier
  }

  showPopOnDownloadFichierContrat() {
    this.successmsg("Contrat telecharger", "Le Contrat  a été bien téléchargé avec succès")
  }

  chargerListeServiceContrat(){
    this.contratService.listeServiceParContrat(this.id$).subscribe(
      (response)=>{
        this.listeService = response['data']
      }, error => {
        this.toastService.error(error,'Erreur')
      }
    )
  }

  openModalAbonnement(content:any, service:Service | undefined = undefined){
    if (service){
      this.formulaireServiceAbonnement.patchValue(service as any)
      this.formulaireServiceAbonnement.get("abonnement_dto").get("distributeur").setValue(service.abonnement?.distributeur?.id.toString())
      this.formulaireServiceAbonnement.get("abonnement_dto").get("parrain").setValue(service.abonnement?.parrain?.id.toString())
      this.formulaireServiceAbonnement.get("abonnement_dto").get("type_abonnement_id").setValue(service.abonnement?.type_abonnement?.id.toString())
      this.formulaireServiceAbonnement.get("abonnement_dto").get("type_journal_id").setValue(service.abonnement?.type_journal?.id.toString())
    }else{
      this.formulaireServiceAbonnement.reset()
      this.formulaireServiceAbonnement.get("abonnement_dto").get("distributeur").setValue(null)
      this.formulaireServiceAbonnement.get("abonnement_dto").get("parrain").setValue(null)
      this.formulaireServiceAbonnement.get("abonnement_dto").get("type_abonnement_id").setValue(null)
      this.formulaireServiceAbonnement.get("abonnement_dto").get("type_journal_id").setValue(null)
      this.formulaireServiceAbonnement.get("abonnement_dto").get("bon_commande").setValue(false)
      this.formulaireServiceAbonnement.get("abonnement_dto").get("contrat").setValue(true)
      this.formulaireServiceAbonnement.get("abonnement_dto").get("paiement_comptant").setValue(false)
      this.formulaireServiceAbonnement.get("type_contrat_id").setValue(1)
      this.formulaireServiceAbonnement.get("abonnement_dto.souscription").get("type_client_id").setValue(3)
      this.formulaireServiceAbonnement.get("abonnement_dto.souscription").get("taux_remise").setValue(0)
    }
    this.modalService.open(content)

  }


  creerModifierAbonnement(){
    if(this.formulaireServiceAbonnement.valid)
        this.contratService.creerAbonnement(this.id$, this.formulaireServiceAbonnement.value).subscribe(
          (response)=>{
            this.listeService.unshift(response['data'])
            this.formulaireServiceAbonnement.reset()
            this.modalService.dismissAll()
            this.successmsg("Service Abonnement Ajouter", "Le Service abonnement a été ajouté avec succès")
          },
          (error)=> {
            this.toastService.error(error.error.message, 'Erreur');
            for (let erreur in error.error.errors) {
              this.toastService.error(erreur + " " + error.error.errors[erreur], 'Erreur');
            }
          }
        )
      }


  openModalInsertion(content:any, service:Service | undefined = undefined){
    if (service){
      this.formulaireServiceAbonnement.reset()
      this.formulaireServiceInsertion.get("devis_dto.groupe_taxation").setValue(null)
    }
    this.modalService.open(content)
  }


  creerInsertion() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir le creer? Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Creer le !',
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.creerModifierInsertion();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // handle cancel action if necessary
      }
    }).catch((error) => {
    });
  }


  creerModifierInsertion(){
    this.formulaireServiceInsertion.get("devis_dto.bon_commande").setValue(false);
    this.formulaireServiceInsertion.get("devis_dto.paiement_comptant").setValue(false);
    this.formulaireServiceInsertion.get("devis_dto.contrat").setValue(true);
    this.formulaireServiceInsertion.get("type_contrat_id").setValue(2)

    if(this.formulaireServiceInsertion.valid)
      this.contratService.creerInsertion(this.id$, this.formulaireServiceInsertion.value).subscribe(
        (response)=>{
          this.listeService.unshift(response['data'])
          this.formulaireServiceInsertion.reset()
          this.modalService.dismissAll()
          this.successmsg("Service Insertion Ajouter", "Le Service insertion a été ajouté avec succès")
        },
        (error)=> {
          this.toastService.error(error.error.message, 'Erreur');
          for (let erreur in error.error.errors) {
            this.toastService.error(erreur + " " + error.error.errors[erreur], 'Erreur');
          }
        }
      )
  }




  goBack(): void {
    this.router.navigate(['commercial/contrat']);
  }

  openModalAvenant(content:any, avenant:Avenant | undefined = undefined){
    if (avenant){
      this.formulaireAvenant.patchValue(avenant as any)
    }else{
      this.formulaireAvenant.reset()
    }
    this.modalService.open(content)
  }


  creerModifierAvenant(){
    if(this.formulaireAvenant.valid )
        this.creerAvenant()
      }

  creerAvenant() {
      const formData = new FormData();
      formData.append('fichier_avenant', this.fichier_contrat as File);
      formData.append('description', this.formulaireAvenant.get('description').value);
      this.contratService.creerAvenant(this.id$,formData)
        .subscribe(
          (response) => {
            this.listeAvenant.unshift(response['data'])
            this.formulaireAvenant.reset()
            this.modalService.dismissAll()
            this.successmsg('Avenant ajouté', 'Vous venez d\'ajouter avec succès un nouveau Avenant !')
          },
          (error) => {
            this.toastService.error(error.error.message, 'Erreur');
            for (let erreur in error.error.errors) {
              this.toastService.error(error.error.errors[erreur], 'Erreur');
            }
          }
        )
  }

  uploaderFicherAvenant($event: any) {
    if($event.target.files.length > 0){
      this.fichier_avenant = $event.target.files[0];
    }
  }


  telechargerFichierAvenantContrat(avenant:Avenant) {
    return this.contratService.contextPath+ 'fichiers/telecharger/FICHE_AVENANT/'+avenant.fichier
  }

  showPopOnDownloadFichierAvenantContrat() {
    this.successmsg("Avenant telecharger", "Le fichier de l'avenant a été bien téléchargé avec succès")
  }

  chargerListeAvenantContrat(){
    this.contratService.listeAveneantContrat(this.id$).subscribe(
      (response)=>{
        this.listeAvenant = response['data']
      }, error => {
        this.toastService.error(error,'Erreur')
      }
    )
  }

  chargerPlainteInsertion() {
    this.plaintes = this.contratService.listePlainteInsertion(this.id$)
      .pipe(
        map(e => {
          this.listePlainte = e.data.content;
          return {dataState: DataStateEnum.CHARGE, data: e}
        }),
        startWith({dataState: DataStateEnum.CHARGEMENT})

      ).pipe(
        catchError(err => {
          return of({dataState: this.dataStateEnum.CHARGE, data: []})
        })
      )
  }


  openModalPlainte(content:any, plainte:Plainte | undefined = undefined){
    if (plainte){
      this.formulairePlainteInsertion.patchValue(plainte as any)
      this.formulairePlainteInsertion.get("type_relance_id").setValue(plainte?.type_relance?.id.toString())
    }else{
      this.formulairePlainteInsertion.reset()
      this.formulairePlainteInsertion.get("type_relance_id").setValue(null)
    }
    this.modalService.open(content)

  }

  creerModifierPlainteInsertion(){
    if(this.formulairePlainteInsertion.valid)
      if(this.formulairePlainteInsertion.get('id').value){
        this.plainteService.modifierPlainte(this.formulairePlainteInsertion.value)
          .subscribe(
            (response)=>{
              this.listePlainte.map(e =>{
                if (e.id == response["data"].id){
                  e.motif = response["data"].motif
                  e.description = response["data"].description
                  e.type_relance = response["data"].type_relance_id
                }
                return e;
              })
              this.modalService.dismissAll()
              this.chargerPlainteInsertion()
              this.successmsg("Plainte modifier", "La plainte a été modifié avec succès")
              this.formulairePlainteInsertion.reset()
            },
            (error)=> {
              this.toastService.error(error.error.message, 'Erreur');
              for (let erreur in error.error.errors) {
                this.toastService.error(erreur + " " + error.error.errors[erreur], 'Erreur');
              }
            }
          )
      }else{
        this.contratService.creerPlainteInsertion(this.id$,this.formulairePlainteInsertion.value).subscribe(
          (response)=>{
            this.formulairePlainteInsertion.reset()
            this.modalService.dismissAll()
            this.chargerPlainteInsertion()
            this.successmsg("Plainte ajouter", "Vous venez d\'ajoutez avec succès une nouvelle plainte a cet contrat !")
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

  supprimerPlainte(id: number) {
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
        this.plainteService.supprimerPlainte(id).subscribe({
          next: (value) => {
            this.devisSbj.next(0);
            this.listePlainte = this.listePlainte.filter(
              (i) => i.id !== id
            );
            this.toastService.success('Suppression réussie', 'Plainte supprimer');
          },
          error: (err) => {
            this.toastService.error(err.error.message, 'Plainte non supprimer');
            this.errormsg('Plainte non supprimer', err.error.message);
          },
        });
      }
    });
  }

  traiterPlainte(id: number) {
    Swal.fire({
      title: 'Êtes vous sûr ?',
      text: 'Êtes vous sûr de vouloir le traiter. Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Traiter le!',
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.value) {
        this.plainteService.traiterPlainte(id).subscribe({
          next: (response) => {
            this.listePlainte.map((e) => {
              if (e.id == response['data'].id) {
                e.etat = true;
              }
              return e;
            });
            this.chargerPlainteId();
            this.toastService.success('Traitement réussie', 'Plainte traiter');
          },
          error: (err) => {
            this.toastService.error(err.error.message, 'Plainte non traiter');
            this.errormsg('Plainte non traiter', err.error.message);
          },
        });
      }
    });
  }

  openModalPlainteDetail(plainte:Plainte, content) {
    this.openModal(content)
    this.idPlainte = plainte.id
    this.chargerPlainteId()
  }

  chargerPlainteId() {
    this.plainteService.voirPlainte(this.idPlainte).subscribe(
      (response)=>{
        this.plainte = response.data
      }
    )
  }



}

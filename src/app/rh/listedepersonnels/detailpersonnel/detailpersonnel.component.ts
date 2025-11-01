import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from "rxjs";
// @ts-ignore
import Hashids from 'hashids'
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { catchError, map, startWith } from "rxjs/operators";
import Swal from "sweetalert2";

import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DataStateEnum, ModelDataState } from '../../../state/state';
import { civilite, Personnel, situationMatrimoniale } from '../../models/personnel';
import { Affectation } from '../../models/affectation';
import { Contrat } from '../../models/contrat';
import { Mission } from '../../models/mission';
import { Demande } from '../../models/demande';
import { Conge } from '../../models/conge';
import { Interimes } from '../../models/interimes';
import { Presence } from '../../models/presence';
import { Pieces } from '../../models/pieces';
import { Service } from '../../models/service';
import { Poste } from '../../models/poste';
import { Banques } from '../../models/banques';
import { MissionnaireExterne } from '../../models/missionnaire-externe';
import { Entites } from '../../models/entites';
import { Indice } from '../../models/indice';
import { TypeDeContrat } from '../../models/type-de-contrat';
import { Dossier } from '../../models/dossier';
import { ModeDePaiement } from '../../models/mode-de-paiement';
import { Avenant } from '../../models/avenant';
import { StatutPersonnel } from '../../models/statut-personnel';
import { TypeDePiece } from '../../models/type-de-piece';
import { TypeDeContratService } from '../../services/type-de-contrat.service';
import { AvenantService } from '../../services/avenant.service';
import { ToastrService } from 'ngx-toastr';
import { PersonnelService } from '../../services/personnel.service';
import { PosteService } from '../../services/poste.service';
import { BanquesService } from '../../services/banques.service';
import { EntitesService } from '../../services/entites.service';
import { TypeDePieceService } from '../../services/type-de-piece.service';
import { ModeDePaiementService } from '../../services/mode-de-paiement.service';
import { StatutPersonnelService } from '../../services/statut-personnel.service';
import { IndiceService } from '../../services/indice.service';
import { PiecesService } from '../../services/pieces.service';
import { AffectationService } from '../../services/affectation.service';
import { InterimesService } from '../../services/interimes.service';
import { ContratService } from '../../services/contrat.service';
import { DossierService } from '../../services/dossier.service';
import { DemandeService } from '../../services/demande.service';
import { PresenceService } from '../../services/presence.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-detailpersonnel',
  templateUrl: './detailpersonnel.component.html',
  styleUrls: ['./detailpersonnel.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
})
export class DetailpersonnelComponent implements OnInit {

  items: any[] = [];
  dataStateEnum = DataStateEnum
  state?: DataStateEnum
  personnel$?: Observable<ModelDataState<Personnel | undefined>>;
  affectations?: Observable<ModelDataState<Affectation[]>>;
  contrats?: Observable<ModelDataState<Contrat[]>>;
  missions?: Observable<ModelDataState<Mission[]>>;
  demandes?: Observable<ModelDataState<Demande[]>>;
  conges?: Observable<ModelDataState<Conge[]>>;
  interims?: Observable<ModelDataState<Interimes[]>>;
  presences?: Observable<ModelDataState<Presence[]>>;
  pieces?: Observable<ModelDataState<Pieces[]>>;
  personnel?: Personnel;
  personnelId: number = 0;
  mois: number = 0;
  nbrJourAbasent: number = 0
  contrat?: Contrat;
  listeDossierPage: Personnel[] = []
  listePoste: Poste[] = []
  listeService: Service[] = []
  listeBanque: Banques[] = []
  listeEntite: Entites[] = []
  listeIndice: Indice[] = []
  listeMissionnaireExterne: MissionnaireExterne[] = []
  listeTypeContrat: TypeDeContrat[] = []
  listeTypeDossier: Dossier[] = []
  listeTypePieces: TypeDePiece[] = []
  listeModeDePaiement: ModeDePaiement[] = []
  listeStatutPersonnel: StatutPersonnel[] = []
  listeAffectationPersonnel: Affectation[] = []
  listeInterimesPersonnel: Interimes[] = []
  listePresencePersonnel: Presence[] = []
  listePiecesPersonnel: Pieces[] = []
  listeContratsPersonnel: Contrat[] = []
  listeMissionPersonnel: Mission[] = []
  listeDemandePersonnel: Demande[] = []
  listeCongePersonnel: Conge[] = []
  listeAvenantContratPersonnel: Avenant[] = []
  piece?: Pieces;
  interime?: Interimes;
  public typeCivilites = Object.values(civilite);
  public situationMatrimoniales = Object.values(situationMatrimoniale);
  PHONE_REGEX = /^[+]?[(]?[0-9]{1,6}[)]?[-\s.]?[0-9]{3,6}[-\s.]?[0-9]{3,6}$/;

  public nom: string = '';
  public matricule: string = '';
  public prenom: string = '';
  public searchValue: string = '';
  public loading: boolean = false;
  public id: number = 0;
  public idPiece: number = 0;
  public idContrat: number = 0;
  public idIterime: number = 0;
  public designation: string = '';
  public sigle: string = '';
  file: File | undefined

  formulaireDebaucher = new FormGroup({
    id: new FormControl(''),
    dateDebauchage: new FormControl(new Date, [Validators.required]),
  })

  formulaireEmbaucher = new FormGroup({
    id: new FormControl(''),
    dateEmbauchage: new FormControl(new Date, [Validators.required]),
  })

  formulaireRetraiter = new FormGroup({
    id: new FormControl(''),
    dateRetraite: new FormControl(new Date, [Validators.required]),
  })

  formulairePresence = new FormGroup({
    id: new FormControl(),
    date: new FormControl('', [Validators.required]),
    estPresent: new FormControl('', [Validators.required]),
    personnel: new FormControl(''),
  })

  formulaireContrat = new FormGroup({
    id: new FormControl(),
    dateDebut: new FormControl<Date | null>(new Date(), [Validators.required]),
    dateFin: new FormControl<Date | null>(new Date(), [Validators.required]),
    typeContrat: new FormControl('', [Validators.required]),
    status: new FormControl<string | null>(null, [Validators.required]),
    personnel: new FormControl<string | null>(null),
  })

  formulairePieces = new FormGroup({
    id: new FormControl(),
    commentaire: new FormControl(''),
    typeDossier: new FormControl('', [Validators.required]),
    personnel: new FormControl(''),
    typePiece: new FormControl('', [Validators.required]),
  })

  formulaireInterim = new FormGroup({
    id: new FormControl(),
    dateDebut: new FormControl(new Date(), [Validators.required]),
    dateFin: new FormControl(new Date(), [Validators.required]),
    personnel: new FormControl<string | null>(null),
    poste: new FormControl('', [Validators.required]),
    commentaire: new FormControl(''),
  })

  // ✅ AFFECTATION sans dateFin
  formulaireAffectation = new FormGroup({
    id: new FormControl(),
    dateDebut: new FormControl(new Date(), [Validators.required]),
    personnel: new FormControl<string | null>(null),
    poste: new FormControl<string | null>(null, [Validators.required]),
  });

  formulaireAvenantContrat = new FormGroup({
    id: new FormControl(),
    date: new FormControl<Date | null>(new Date(), [Validators.required]),
    contrat: new FormControl(null),
    estActif: new FormControl(false, [Validators.required]),
  })

  // ⚠️ Les champs « banque / modePaiement / RIB » restent dans le formulaire,
  // mais on ne lit plus ces infos depuis `personnel` (c’est ce qui cassait).
  formulaireDossier = new FormGroup({
    id: new FormControl(),

    identitePersonnelGroupe: this.formBuilder.group({
      matricule: new FormControl('', [Validators.required]),
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      civilite: new FormControl('', [Validators.required]),
      dateDeNaissance: new FormControl('', [Validators.required]),
      referenceComptable: new FormControl(''),
      situationMatrimoniale: new FormControl(''),
      statutPersonnel: new FormControl<string | null>(null, [Validators.required]),
      nombreEnfant: new FormControl('', [Validators.required]),
      pieceIdentite: new FormControl(''),
      numeroCnss: new FormControl(''),
      telephone: new FormControl('', [Validators.pattern(this.PHONE_REGEX)]),
      dateEmbauchage: new FormControl('', [Validators.required]),
      adresse: new FormControl(''),
    }),

    personneContacterGroupe: this.formBuilder.group({
      telephoneContact: new FormControl('', [Validators.pattern(this.PHONE_REGEX)]),
      prenomContact: new FormControl(''),
      nomContact: new FormControl(''),
    }),

    identiteBanquePersonneGroupe: this.formBuilder.group({
      banque: new FormControl<string | null>(null),
      cleRib: new FormControl('', [Validators.minLength(2), Validators.maxLength(2)]),
      codeBanque: new FormControl('', [Validators.minLength(5), Validators.maxLength(5)]),
      codeGuichet: new FormControl('', [Validators.minLength(5), Validators.maxLength(5)]),
      numeroCompte: new FormControl(''),
      modePaiement: new FormControl<string | null>(null),
    }),

    autrePersonnelGroupe: this.formBuilder.group({
      poste: new FormControl<string | null>(null, [Validators.required]),
      entite: new FormControl<string | null>(null, [Validators.required]),
      indice: new FormControl<string | null>(null),
    }),
  })

  totalDossier: number = 0;
  totalPieces: number = 0;
  totalPresence: number = 0;
  totalInterims: number = 0;
  totalAffectation: number = 0;
  totalContrat: number = 0;
  totalAvenant: number = 0;
  totalMission: number = 0;
  totalConge: number = 0;
  totalDemande: number = 0;
  currentPage: number = 0;
  dossierPerPage: number = 8;
  nombrePerPage: number = 5;
  breadCrumbItems: Array<{ label: string; active?: boolean }> = [];
  sort: string = "desc";
  public pages: number[] = [];
  totalPages: number = 0;
  hashids: any
  private id$: any;
  devisSbj = new BehaviorSubject(0);

  constructor(
    private personnelService: PersonnelService,
    private posteService: PosteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastrService,
    private banqueService: BanquesService,
    private avenantService: AvenantService,
    private typedecontratService: TypeDeContratService,
    private entiteService: EntitesService,
    private typedepieceService: TypeDePieceService,
    private dossierService: DossierService,
    private demandeService: DemandeService,
    private presenceService: PresenceService,
    private contratService: ContratService,
    private interimesService: InterimesService,
    private affectationService: AffectationService,
    private piecesService: PiecesService,
    private indiceService: IndiceService,
    private formBuilder: FormBuilder,
    private modeDePaiementService: ModeDePaiementService,
    private statutPersonnelService: StatutPersonnelService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr');
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Form Wizard', active: true }];
    this.hashids = new Hashids('mysecretkey');
    this.activatedRoute.paramMap.subscribe((params) => {
      const encodedId = params.get('id');
      if (encodedId) {
        this.id$ = this.decodeId(encodedId);
      } else {
        console.warn('ID parameter is missing');
      }
    });
    this.items = [
      { label: 'Ressources Humaines' },
      { label: 'Personnels' },
      { label: 'Details', active: true },
    ];
    this.chargerIdPersonnel(this.id$);
    this.chargerListePiecesPersonnel();
  }

  decodeId(encodedId: string) {
    const [id] = this.hashids.decode(encodedId);
    return id;
  }

  onNext(stepper: MatStepper): void {
    stepper.next();
  }

  onSearchPoste(designation: string) {
    if (designation.length >= 3) {
      this.posteService.recherchePoste(designation).subscribe(
        (response: any) => { this.listePoste = response.body.content },
        () => {}
      );
    }
  }

  onSearchBanque(sigle: string) {
    if (sigle.length >= 1) {
      this.banqueService.rechercheBanque(sigle).subscribe(
        (response: any) => { this.listeBanque = response.body.content },
        () => {}
      );
    }
  }

  onSearchDossier(designation: string) {
    if (designation.length >= 3) {
      this.dossierService.rechercheDossier(designation).subscribe(
        (response: any) => { this.listeTypeDossier = response.body.content },
        () => {}
      );
    }
  }

  onSearchTypeDePieces(nom: string) {
    if (nom.length >= 2) {
      this.typedepieceService.rechercheTypeDePiece(nom).subscribe(
        (response: any) => { this.listeTypePieces = response.body.content },
        () => {}
      );
    }
  }

  onSearchTypeContrat(sigle: string) {
    if (sigle.length >= 1) {
      this.typedecontratService.rechercheTypeDeContrat(sigle).subscribe(
        (response: any) => { this.listeTypeContrat = response.body.content },
        () => {}
      );
    }
  }

  onSearchEntite(designation: string) {
    if (designation.length >= 3) {
      this.entiteService.rechercheEntite(designation).subscribe(
        (response: any) => { this.listeEntite = response.body.content },
        () => {}
      );
    }
  }

  onSearchIndice(nom: string) {
    if (nom.length >= 3) {
      this.indiceService.rechercheIndice(nom).subscribe(
        (response: any) => { this.listeIndice = response.body.content },
        () => {}
      );
    }
  }

  onSearchModeDePaiement(designation: string) {
    if (designation.length >= 3) {
      this.modeDePaiementService.rechercheModeDePaiement(designation).subscribe(
        (response: any) => { this.listeModeDePaiement = response.body.content },
        () => {}
      );
    }
  }

  onSearchStatutPersonnel(designation: string) {
    if (designation.length >= 3) {
      this.statutPersonnelService.rechercheStatutPersonnel(designation).subscribe(
        (response: any) => { this.listeStatutPersonnel = response.body.content },
        () => {}
      );
    }
  }

  chargerIdPersonnel(id: number) {
    this.activatedRoute.params.subscribe(() => {
      this.chargeInformationPersonnel(id);
      this.chargerListePresencePersonnel();
      this.chargerListeInterimesPersonnel();
      this.chargerListeAffectationPersonnel();
      this.chargerListeContratPersonnel();
      this.chargerListeMissionsPersonnel();
      this.chargerListeCongesPersonnel();
      this.chargerListeDemandesPersonnel();
    });
  }

  chargeInformationPersonnel(id: number) {
    this.personnel$ = this.personnelService.voirPersonnel(id)
      .pipe(
        map((response: any) => {
          this.personnel = response;
          const today = new Date();
          const dateDeNaissance = new Date(response.dateDeNaissance);
          if (this.personnel) {
            this.personnel.isSameDayAndMonth =
              dateDeNaissance.getMonth() === today.getMonth() &&
              dateDeNaissance.getDate() === today.getDate();
            this.personnel.age = this.calculateAge(dateDeNaissance);
          }
          return { dataState: DataStateEnum.CHARGE, data: { ...response } };
        }),
        startWith({ dataState: DataStateEnum.CHARGEMENT })
      )
      .pipe(
        catchError(() => of({ dataState: this.dataStateEnum.CHARGE, data: undefined }))
      );
  }

  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  isSameDayAndMonth(date: Date): boolean {
    const today = new Date();
    return (date.getMonth() === today.getMonth() && date.getDate() === today.getDate());
  }

  goBack(): void { this.router.navigate(['rh/personnels']); }

  openModal(content: any, _personnel: Personnel) { this.modalService.open(content) }
  openModalEmbaucher(content: any, _personnel: Personnel) { this.modalService.open(content) }

  ajouterSignature() {
    const formData = new FormData();
    formData.append('file', this.file as File);
    this.personnelService.ajouterSignaturePersonnel(this.id$, formData)
      .subscribe(
        () => {
          this.modalService.dismissAll()
          this.chargerIdPersonnel(this.id$)
          if (this.personnel?.signature == null) {
            this.successmsg("Signature ajouté", "La signature a été ajouté avec succès")
          } else {
            this.successmsg("Signature modifiée", "La signature a été modifiée avec succès")
          }
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
    if ($event.target.files.length > 0) { this.file = $event.target.files[0]; }
  }

  telechargerSignature(personnel: Personnel) {
    return `${this.personnelService.contextPath}/telecharger/` + personnel.signature;
  }

  showPopOnDownloadSignature() {
    this.successmsg('Signature telechargée', "La signature a été bien téléchargée avec succès");
  }

  closeModal() { this.modalService.dismissAll() }

  successmsg(title = 'Poste ajouté !', message = 'Vous venez d\'ajoutez avec succès un nouveau Poste !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message: string) { Swal.fire(title, message, 'error'); }

  get formPersonnel() { return this.formulaireDossier.controls; }

  openModalPersonnel(content: any, dossier: Personnel | undefined = undefined) {
    if (dossier) {
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

      // 🧹 SUPPRIMÉ : lecture banque/modePaiement/RIB depuis `dossier`
      // (c’est ce qui causait l’erreur, car le type `Personnel` ne les expose pas)
      this.formPersonnel.identiteBanquePersonneGroupe['controls'].banque.setValue(null)
      this.formPersonnel.identiteBanquePersonneGroupe['controls'].cleRib.setValue('')
      this.formPersonnel.identiteBanquePersonneGroupe['controls'].codeBanque.setValue('')
      this.formPersonnel.identiteBanquePersonneGroupe['controls'].codeGuichet.setValue('')
      this.formPersonnel.identiteBanquePersonneGroupe['controls'].numeroCompte.setValue('')
      this.formPersonnel.identiteBanquePersonneGroupe['controls'].modePaiement.setValue(null)

      this.formPersonnel.autrePersonnelGroupe['controls'].poste.setValue(dossier?.poste?.designation?.toString())
      this.formPersonnel.autrePersonnelGroupe['controls'].entite.setValue(dossier?.entite?.designation?.toString())
      this.formPersonnel.autrePersonnelGroupe['controls'].indice.setValue(dossier?.indice?.nom?.toString())
    } else {
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
    let formDataPersonnel: any = null;
    if (this.formulaireDossier.valid) {
      const statutPersonnelValue = this.formPersonnel.identitePersonnelGroupe['controls'].statutPersonnel.value;
      const isStatutPersonnelNumber = statutPersonnelValue != null && !isNaN(Number(statutPersonnelValue)) && isFinite(Number(statutPersonnelValue));

      const banqueValue = this.formPersonnel.identiteBanquePersonneGroupe['controls'].banque.value;
      const isBanqueValid = banqueValue != null && !isNaN(Number(banqueValue)) && isFinite(Number(banqueValue));

      const modePaiementValue = this.formPersonnel.identiteBanquePersonneGroupe['controls'].modePaiement.value;
      const isModePaiementValid = modePaiementValue != null && !isNaN(Number(modePaiementValue)) && isFinite(Number(modePaiementValue));

      const posteValue = this.formPersonnel.autrePersonnelGroupe['controls'].poste.value;
      const isPosteValid = posteValue != null && !isNaN(Number(posteValue)) && isFinite(Number(posteValue));

      const entiteValue = this.formPersonnel.autrePersonnelGroupe['controls'].entite.value;
      const isEntiteValid = entiteValue != null && !isNaN(Number(entiteValue)) && isFinite(Number(entiteValue));

      const indiceValue = this.formPersonnel.autrePersonnelGroupe['controls'].indice.value;
      const isIndiceValid = indiceValue != null && !isNaN(Number(indiceValue)) && isFinite(Number(indiceValue));

      formDataPersonnel = {
        "matricule": this.formPersonnel.identitePersonnelGroupe['controls'].matricule.value || null,
        "nom": this.formPersonnel.identitePersonnelGroupe['controls'].nom.value || null,
        "prenom": this.formPersonnel.identitePersonnelGroupe['controls'].prenom.value || null,
        "civilite": this.formPersonnel.identitePersonnelGroupe['controls'].civilite.value || null,
        "dateDeNaissance": this.formPersonnel.identitePersonnelGroupe['controls'].dateDeNaissance.value || null,
        "referenceComptable": this.formPersonnel.identitePersonnelGroupe['controls'].referenceComptable.value || null,
        "situationMatrimoniale": this.formPersonnel.identitePersonnelGroupe['controls'].situationMatrimoniale.value || null,
        "statutPersonnel": isStatutPersonnelNumber ? statutPersonnelValue : null,
        "nombreEnfant": this.formPersonnel.identitePersonnelGroupe['controls'].nombreEnfant.value || null,
        "pieceIdentite": this.formPersonnel.identitePersonnelGroupe['controls'].pieceIdentite.value || null,
        "numeroCnss": this.formPersonnel.identitePersonnelGroupe['controls'].numeroCnss.value || null,
        "telephone": this.formPersonnel.identitePersonnelGroupe['controls'].telephone.value || null,
        "dateEmbauchage": this.formPersonnel.identitePersonnelGroupe['controls'].dateEmbauchage.value,
        "adresse": this.formPersonnel.identitePersonnelGroupe['controls'].adresse.value || null,

        "telephoneContact": this.formPersonnel.personneContacterGroupe['controls'].telephoneContact.value || null,
        "prenomContact": this.formPersonnel.personneContacterGroupe['controls'].prenomContact.value || null,
        "nomContact": this.formPersonnel.personneContacterGroupe['controls'].nomContact.value || null,

        // ✅ on garde l’envoi éventuel au backend, mais sans le lier à `personnel`
        "banque": isBanqueValid ? banqueValue : null,
        "cleRib": this.formPersonnel.identiteBanquePersonneGroupe['controls'].cleRib.value || null,
        "codeBanque": this.formPersonnel.identiteBanquePersonneGroupe['controls'].codeBanque.value || null,
        "codeGuichet": this.formPersonnel.identiteBanquePersonneGroupe['controls'].codeGuichet.value || null,
        "numeroCompte": this.formPersonnel.identiteBanquePersonneGroupe['controls'].numeroCompte.value || null,
        "modePaiement": isModePaiementValid ? modePaiementValue : null,

        "poste": isPosteValid ? posteValue : null,
        "entite": isEntiteValid ? entiteValue : null,
        "indice": isIndiceValid ? indiceValue : null,
      };
    }

    if (this.formulaireDossier.get('id')?.value) {
      this.personnelService.modifierPersonnel(this.formulaireDossier.get('id')?.value, formDataPersonnel)
        .subscribe(
          (response: any) => {
            this.listeDossierPage = this.listeDossierPage.map(e => {
              if (e.id === response["data"].id) {
                e = {
                  ...e,
                  matricule: response["data"].matricule,
                  nom: response["data"].nom,
                  prenom: response["data"].prenom,
                  civilite: response["data"].civilite,
                  dateDeNaissance: response["data"].dateDeNaissance,
                  referenceComptable: response["data"].referenceComptable,
                  situationMatrimoniale: response["data"].situationMatrimoniale,
                  statutPersonnel: response["data"].statutPersonnel,
                  nombreEnfant: response["data"].nombreEnfant,
                  pieceIdentite: response["data"].pieceIdentite,
                  numeroCnss: response["data"].numeroCnss,
                  telephone: response["data"].telephone,
                  dateEmbauchage: response["data"].dateEmbauchage,
                  adresse: response["data"].adresse,
                  telephoneContact: response["data"].telephoneContact,
                  prenomContact: response["data"].prenomContact,
                  nomContact: response["data"].nomContact,
                  // 🧹 pas d’accès à e.banque / e.modePaiement / e.cleRib etc.
                  poste: response["data"].poste,
                  entite: response["data"].entite,
                  indice: response["data"].indice
                };
              }
              return e;
            });
            this.modalService.dismissAll();
            this.chargerIdPersonnel(this.id$);
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
      this.personnelService.creerPersonnel(formDataPersonnel).subscribe(
        (response: any) => {
          this.listeDossierPage.unshift(response['data']);
          this.formulaireDossier.reset();
          this.modalService.dismissAll();
          this.chargerIdPersonnel(this.id$);
          this.successmsg("Personnel créé", "Le Personnel a été créé avec succès");
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

  supprimerPersonnel() {
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
        this.personnelService.supprimerPersonnel(this.id$).subscribe({
          next: () => {
            this.devisSbj.next(0);
            this.listeDossierPage = this.listeDossierPage.filter((i) => i.id !== this.id$);
            this.goBack()
            this.successmsg('Personnel supprimer', 'Suppression réussie');
          },
          error: (err) => {
            this.errormsg('Personnel non supprimer', err.error.message);
          },
        });
      }
    });
  }

  get activationFormDebaucher() { return this.formulaireDebaucher.controls; }
  get activationFormEmbaucher() { return this.formulaireEmbaucher.controls; }

  debaucherPersonnel() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir le débaucher? Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Débaucher le !',
      cancelButtonText: 'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.debauche();
      }
    }).catch(() => {});
  }

  embaucherPersonnel() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir le re embaucher? Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Re Embaucher le !',
      cancelButtonText: 'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) { this.embauche(); }
    }).catch(() => {});
  }

  debauche() {
    const { dateDebauchage } = this.formulaireDebaucher.value;
    const selectedDate = dateDebauchage ? new Date(dateDebauchage) : new Date();
    this.personnelService.debaucherPersonnel(this.id$, selectedDate).subscribe(() => {
      Swal.fire('Personnel', 'Débauchage réussi');
      this.modalService.dismissAll();
      this.chargerIdPersonnel(this.id$);
    });
  }

  embauche() {
    const { dateEmbauchage } = this.formulaireEmbaucher.value;
    const selectedDate = dateEmbauchage ? new Date(dateEmbauchage) : new Date();
    this.personnelService.embaucherPersonnel(this.id$, selectedDate).subscribe(() => {
      Swal.fire('Personnel', 'REEmbauchage réussi');
      this.modalService.dismissAll();
      this.chargerIdPersonnel(this.id$);
    });
  }

  get activationFormRetraite() { return this.formulaireRetraiter.controls; }

  retraitePersonnel() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir le mettre en retraite? Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Mettre en retraite !',
      cancelButtonText: 'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) { this.retraite(); }
    }).catch(() => {});
  }

  retraite() {
    const { dateRetraite } = this.formulaireRetraiter.value;
    const selectedDate = dateRetraite ? new Date(dateRetraite) : new Date();
    this.personnelService.retraitePersonnel(this.id$, selectedDate).subscribe(() => {
      Swal.fire('Personnel', 'Mise en Retraite réussi');
      this.modalService.dismissAll();
      this.chargerIdPersonnel(this.id$);
    });
  }

  getDateAujourdhuiISO(): string {
    const now = new Date();
    const annee = now.getFullYear();
    const mois = String(now.getMonth() + 1).padStart(2, '0');
    const jour = String(now.getDate()).padStart(2, '0');
    return `${annee}-${mois}-${jour}`;
  }

  chargerListePiecesPersonnel() {
    this.pieces = this.personnelService.listerPiecesPersonnel(this.id$, this.currentPage, this.nombrePerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listePiecesPersonnel = response.body.content;
          this.totalPieces = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listePiecesPersonnel };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      )
      .pipe(catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] })));
  }

  chargerListePresencePersonnel() {
    this.presences = this.personnelService.listerPresencePersonnel(this.id$, this.currentPage, this.nombrePerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listePresencePersonnel = response.body.content;
          this.totalPresence = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listePresencePersonnel };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      )
      .pipe(catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] })));
  }

  chargerListeInterimesPersonnel() {
    this.interims = this.personnelService.listerInterimePersonnel(this.id$, this.currentPage, this.nombrePerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeInterimesPersonnel = response.body.content;
          this.totalInterims = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listeInterimesPersonnel };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      )
      .pipe(catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] })));
  }

  chargerListeAffectationPersonnel() {
    this.affectations = this.personnelService.listerAffectationPersonnel(this.id$, this.currentPage, this.nombrePerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeAffectationPersonnel = response.body.content;
          this.totalAffectation = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listeAffectationPersonnel };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      )
      .pipe(catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] })));
  }

  chargerListeContratPersonnel() {
    this.contrats = this.personnelService.listerContratPersonnel(this.id$, this.currentPage, this.nombrePerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeContratsPersonnel = response.body.content;
          this.totalContrat = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listeContratsPersonnel };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      )
      .pipe(catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] })));
  }

  isTodayBetweenDates(startDate: Date, endDate: Date): boolean {
    const today = new Date();
    return startDate <= today && endDate >= today;
  }

  encodeId(id: number) { return this.hashids.encode(id); }

  chargerListeMissionsPersonnel() {
    this.missions = this.personnelService.listerMissionsPersonnel(this.id$, this.currentPage, this.nombrePerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeMissionPersonnel = response.body.content;
          this.listeMissionPersonnel.forEach((mission: Mission) => {
            const startDate = new Date(mission.dateDebut);
            const endDate = new Date(mission.dateFin);
            mission.isTodayBetweenDates = this.isTodayBetweenDates(startDate, endDate);
          });
          this.totalMission = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listeMissionPersonnel };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      )
      .pipe(catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] })));
  }

  chargerListeDemandesPersonnel() {
    this.demandes = this.personnelService.listerDemandesPersonnel(this.id$, this.currentPage, this.nombrePerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeDemandePersonnel = response.body.content;
          this.totalDemande = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listeDemandePersonnel };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      )
      .pipe(catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] })));
  }

  chargerListeCongesPersonnel() {
    this.conges = this.personnelService.listerCongesPersonnel(this.id$, this.currentPage, this.nombrePerPage, this.sort)
      .pipe(
        map((response: any) => {
          this.listeCongePersonnel = response.body.content;
          this.totalConge = response.body.totalElements;
          this.totalPages = response.body.totalPages;
          this.pages = this.getPages();
          return { dataState: this.dataStateEnum.CHARGE, data: this.listeCongePersonnel };
        }),
        startWith({ dataState: this.dataStateEnum.CHARGEMENT })
      )
      .pipe(catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] })));
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) { pages.push(i); }
    return pages;
  }

  openModalPresence(content: any, presence: Presence | undefined = undefined) {
    if (presence) {
      this.formulairePresence.patchValue(presence as any)
      this.formulairePresence.get('personnel')?.setValue(presence?.personnel?.prenom.toString() + ' ' + presence?.personnel?.nom.toString())
      this.formulairePresence.get('estPresent')?.setValue(presence?.estPresent.toString())
    } else {
      this.formulairePresence.reset()
      this.formulairePresence.get('personnel')?.setValue(this.id$)
    }
    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
  }

  marquerPresencePersonnel() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir lui marquer la présence? Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Marquer !',
      cancelButtonText: 'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) { this.creeModifierPresence(); }
    }).catch(() => {});
  }

  creeModifierPresence() {
    if (this.formulairePresence.valid)
      if (this.formulairePresence.get('id')?.value) {
        this.presenceService.modifierPresence(this.formulairePresence.get("id")?.value, this.nbrJourAbasent)
          .subscribe(
            (response: any) => {
              this.listePresencePersonnel.map(e => {
                if (e.id == response["data"].id) {
                  e.date = response["data"].date
                  e.estPresent = response["data"].estPresent
                }
                return e;
              })
              this.modalService.dismissAll()
              this.chargerIdPersonnel(this.id$)
              this.successmsg("Présence modifiée", "La présence a été modifiée avec succès")
              this.formulairePresence.reset()
            },
            (error) => {
              const errors = error.error.errors;
              for (let i = 0; i < errors.length; i++) {
                const currentError = errors[i];
                this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
              }
            }
          )
      } else {
        this.presenceService.creerPresence(this.personnelId, this.nbrJourAbasent, this.mois).subscribe(
          (response: any) => {
            this.listePresencePersonnel.unshift(response['data'])
            this.formulairePresence.reset()
            this.modalService.dismissAll()
            this.chargerIdPersonnel(this.id$)
            this.successmsg("Présence marquée", "La présence a été marquée avec succès")
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
  }

  updateDate(event: any): void {
    const dateValue = event;
    this.formulairePresence.get('date')?.patchValue(dateValue, { emitEvent: false });
  }

  supprimerPresence(id: number) {
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
        this.presenceService.supprimerPresence(id).subscribe({
          next: () => {
            this.devisSbj.next(0);
            this.listePresencePersonnel = this.listePresencePersonnel.filter((i) => i.id !== id);
            this.chargerIdPersonnel(this.id$)
            this.successmsg('Suppression réussie', 'Présence supprimée');
          },
          error: (err) => {
            this.errormsg('Présence non supprimée', err.error.message);
          },
        });
      }
    });
  }

  openModalContrat(content: any, contrat: Contrat | undefined = undefined) {
    if (contrat) {
      this.formulaireContrat.patchValue(contrat as any)
      this.formulaireContrat.get('personnel')?.setValue(contrat?.personnel?.prenom.toString() + ' ' + contrat?.personnel?.nom.toString())
      this.formulaireContrat.get('typeContrat')?.setValue(contrat?.typeContrat?.id.toString())
    } else {
      this.formulaireContrat.reset()
      this.formulaireContrat.get('typeContrat')?.setValue(null)
      this.formulaireContrat.get('status')?.setValue(null)
    }
    this.modalService.open(content)
  }

  creeModifierContrat() {
    const formData = new FormData();
    formData.append('file', this.file as File);
    formData.append('dateDebut', this.formulaireContrat.get('dateDebut')?.value?.toString() || '');
    formData.append('dateFin', this.formulaireContrat.get('dateFin')?.value?.toString() || '');
    formData.append('typeContrat', this.formulaireContrat.get('typeContrat')?.value || '');
    formData.append('status', this.formulaireContrat.get('status')?.value || '');
    formData.append('personnel', this.id$);
    if (this.formulaireContrat.valid)
      if (this.formulaireContrat.get('id')?.value) {
        this.contratService.modifierContrat(this.formulaireContrat.get("id")?.value, formData)
          .subscribe(
            (response: any) => {
              this.listeContratsPersonnel.map(e => {
                if (e.id == response.id) {
                  e.dateDebut = response.dateDebut
                  e.dateFin = response.dateFin
                  e.typeContrat = response.typeContrat
                  e.status = response.status
                }
                return e;
              })
              this.modalService.dismissAll()
              this.chargerIdPersonnel(this.id$)
              this.successmsg("Contrat modifié", "Le contrat a été modifié avec succès")
              this.formulaireContrat.reset()
            },
            (error) => {
              const errors = error.error.errors;
              for (let i = 0; i < errors.length; i++) {
                const currentError = errors[i];
                this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
              }
            }
          )
      } else {
        this.contratService.creerContrat(this.personnelId, formData).subscribe(
          (response: any) => {
            this.listeContratsPersonnel.unshift(response['data'])
            this.formulaireContrat.reset()
            this.modalService.dismissAll()
            this.chargerIdPersonnel(this.id$)
            this.successmsg("Contrat créé", "Le contrat a été créé avec succès")
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
  }

  supprimerContrat(id: number) {
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
        this.contratService.supprimerContrat(id).subscribe({
          next: () => {
            this.devisSbj.next(0);
            this.listeContratsPersonnel = this.listeContratsPersonnel.filter((i) => i.id !== id);
            this.chargerIdPersonnel(this.id$)
            this.successmsg('Suppression réussie', 'Contrat supprimé');
          },
          error: (err) => {
            this.errormsg('Contrat non supprimé', err.error.message);
          },
        });
      }
    });
  }

  telechargerFicheContrat(contrat: Contrat) {
    return `${this.contratService.contextPath}/telecharger/` + contrat?.fichier;
  }
  showPopOnDownloadFicheContrat() {
    this.successmsg('Ficher Contrat telechargé', "Le Ficher du contrat a été bien téléchargé avec succès");
  }

  telechargerRapportMission(mission: Mission) {
    return `${this.contratService.contextPath}/telecharger/` + mission?.rapport;
  }
  showPopOnDownloadRapportMission() {
    this.successmsg('Rapport de Mission telechargé', "Le Rapport de la Mission a été bien téléchargé avec succès");
  }

  openModalDetails(content: any, missionnaireexternes?: MissionnaireExterne[]) {
    this.modalService.open(content);
    this.listeMissionnaireExterne = []
    if (missionnaireexternes) { this.listeMissionnaireExterne = missionnaireexternes }
  }

  openModalPiece(content: any, pieces: Pieces | undefined = undefined) {
    if (pieces) {
      this.formulairePieces.patchValue(pieces as any)
      this.formulairePieces.get('personnel')?.setValue(pieces?.personnel?.prenom.toString() + ' ' + pieces?.personnel?.nom.toString())
      this.formulairePieces.get('typeDossier')?.setValue(pieces?.typeDossier?.designation.toString())
      this.formulairePieces.get('typePiece')?.setValue(pieces?.typePiece?.nom.toString())
    } else {
      this.formulairePieces.reset()
      this.formulairePieces.get('typeDossier')?.setValue(null)
      this.formulairePieces.get('typePiece')?.setValue(null)
    }
    this.modalService.open(content)
  }

  creeModifierPiece() {
    const formData = new FormData();
    formData.append('file', this.file as File);
    formData.append('commentaire', this.formulairePieces.get('commentaire')?.value || '');
    formData.append('typeDossier', this.formulairePieces.get('typeDossier')?.value || '');
    formData.append('typePiece', this.formulairePieces.get('typePiece')?.value || '');
    formData.append('personnel', this.id$);
    if (this.formulairePieces.valid)
      if (this.formulairePieces.get('id')?.value) {
        this.piecesService.modifierPieces(this.formulairePieces.get("id")?.value, formData)
          .subscribe(
            (response: any) => {
              this.listePiecesPersonnel.map(e => {
                if (e.id == response["data"].id) {
                  e.commentaire = response["data"].commentaire
                  e.typeDossier = response["data"].typeDossier
                  e.typePiece = response["data"].typePiece
                }
                return e;
              })
              this.modalService.dismissAll()
              this.chargerIdPersonnel(this.id$)
              this.successmsg("Pièce modifiée", "La pièce a été modifiée avec succès")
              this.formulairePieces.reset()
            },
            (error) => {
              const errors = error.error.errors;
              for (let i = 0; i < errors.length; i++) {
                const currentError = errors[i];
                this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
              }
            }
          )
      } else {
        this.piecesService.creerPieces(formData).subscribe(
          (response: any) => {
            this.listePiecesPersonnel.unshift(response['data'])
            this.formulairePieces.reset()
            this.modalService.dismissAll()
            this.chargerIdPersonnel(this.id$)
            this.successmsg("Pièce créée", "La Pièce a été créée avec succès")
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
  }

  supprimerPieces(id: number) {
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
        this.piecesService.supprimerPieces(id).subscribe({
          next: () => {
            this.devisSbj.next(0);
            this.listePiecesPersonnel = this.listePiecesPersonnel.filter((i) => i.id !== id);
            this.chargerIdPersonnel(this.id$)
            this.successmsg('Suppression réussie', 'Pièce supprimée');
          },
          error: (err) => { this.errormsg('Pièce non supprimée', err.error.message); },
        });
      }
    });
  }

  telechargerFichePiece(pieces: Pieces) {
    return `${this.piecesService.contextPath}/telecharger/` + pieces?.fichier;
  }
  showPopOnDownloadFichePiece() {
    this.successmsg('Ficher Pièce telechargé', "Le Ficher de la pièce a été bien téléchargé avec succès");
  }

  openModalPieceDetail(pieces: Pieces, content: any) {
    this.modalService.open(content);
    this.idPiece = pieces.id;
    this.chargerPieceId();
  }

  chargerPieceId() {
    this.piecesService.voirPieces(this.idPiece).subscribe((response) => { this.piece = response; });
  }

  openModalInterim(content: any, interimes: Interimes | undefined = undefined) {
    if (interimes) {
      this.formulaireInterim.patchValue(interimes as any)
      this.formulaireInterim.get('personnel')?.setValue(interimes?.personnel?.prenom.toString() + ' ' + interimes?.personnel?.nom.toString())
      this.formulaireInterim.get('poste')?.setValue(interimes?.poste?.designation.toString())
    } else {
      this.formulaireInterim.reset()
      this.formulaireInterim.get('poste')?.setValue(null)
      this.formulaireInterim.get('personnel')?.setValue(this.id$)
    }
    this.modalService.open(content)
  }

  creeModifierInterim() {
    if (this.formulaireInterim.valid)
      if (this.formulaireInterim.get('id')?.value) {
        this.interimesService.modifierInterimes(this.formulaireInterim.get("id")?.value, this.formulaireInterim.value)
          .subscribe(
            (response: any) => {
              this.listeInterimesPersonnel.map(e => {
                if (e.id == response["data"].id) {
                  e.commentaire = response["data"].commentaire
                  e.poste = response["data"].poste
                  e.dateDebut = response["data"].dateDebut
                  e.dateFin = response["data"].dateFin
                }
                return e;
              })
              this.modalService.dismissAll()
              this.chargerIdPersonnel(this.id$)
              this.successmsg("Interime modifié", "L'interime a été modifié avec succès")
              this.formulaireInterim.reset()
            },
            (error) => {
              const errors = error.error.errors;
              for (let i = 0; i < errors.length; i++) {
                const currentError = errors[i];
                this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
              }
            }
          )
      } else {
        this.interimesService.creerInterimes(this.formulaireInterim.value).subscribe(
          (response: any) => {
            this.listeInterimesPersonnel.unshift(response['data'])
            this.formulaireInterim.reset()
            this.modalService.dismissAll()
            this.chargerIdPersonnel(this.id$)
            this.successmsg("Interime créé", "L'interime a été créé avec succès")
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
  }

  supprimerInterime(id: number) {
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
        this.interimesService.supprimerInterimes(id).subscribe({
          next: () => {
            this.devisSbj.next(0);
            this.listeInterimesPersonnel = this.listeInterimesPersonnel.filter((i) => i.id !== id);
            this.chargerIdPersonnel(this.id$)
            this.successmsg('Suppression réussie', 'Interime supprimé');
          },
          error: (err) => {
            this.errormsg('Interime non supprimé', err.error.message);
          },
        });
      }
    });
  }

  openModalInterimeDetail(interimes: Interimes, content: any) {
    this.modalService.open(content);
    this.idIterime = interimes.id;
    this.chargerInterimeId();
  }

  chargerInterimeId() {
    this.interimesService.voirInterimes(this.idIterime).subscribe((response: any) => { this.interime = response; });
  }

  openModalAfectation(content: any, affectation: Affectation | undefined = undefined) {
    if (affectation) {
      this.formulaireAffectation.patchValue({
        id: affectation.id ?? null,
        dateDebut: affectation.dateDebut ? new Date(affectation.dateDebut) : new Date(),
        personnel: affectation.personnel?.id ? String(affectation.personnel.id) : null,
        poste: affectation.poste?.id ? String(affectation.poste.id) : null,
      });
    } else {
      this.formulaireAffectation.reset();
      this.formulaireAffectation.get('poste')?.setValue(null);
      this.formulaireAffectation.get('personnel')?.setValue(this.id$ ? String(this.id$) : null);
      this.formulaireAffectation.get('dateDebut')?.setValue(new Date());
    }
    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
  }

  private formatDateYYYYMMDD(d: Date | string | null): string {
    if (!d) return '';
    const x = new Date(d);
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, '0');
    const dd = String(x.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  creeModifierAffectation() {
    if (!this.formulaireAffectation.valid) return;
    const v = this.formulaireAffectation.value;
    const dto = {
      personnel: Number(v.personnel ?? this.id$),
      poste: Number(v.poste),
      dateDebut: this.formatDateYYYYMMDD(v.dateDebut as Date),
    };

    if (this.formulaireAffectation.get('id')?.value) {
      this.affectationService.modifier(Number(this.formulaireAffectation.get('id')?.value), dto)
        .subscribe(
          (response: any) => {
            this.listeAffectationPersonnel = this.listeAffectationPersonnel.map(e => {
              if (e.id === response.id) {
                return { ...e, poste: response.poste, dateDebut: response.dateDebut };
              }
              return e;
            });
            this.modalService.dismissAll();
            this.chargerIdPersonnel(this.id$);
            this.successmsg("Affectation modifiée", "L'affectation a été modifiée avec succès");
            this.formulaireAffectation.reset();
          },
          (error: any) => {
            const errors = error?.error?.errors ?? [];
            for (const currentError of errors) {
              this.toastService.error(`${currentError.champs}: ${currentError.message}`, 'Erreur!');
            }
          }
        );
    } else {
      this.affectationService.creer(dto).subscribe(
        (response: any) => {
          this.listeAffectationPersonnel.unshift(response['data'] ?? response);
          this.formulaireAffectation.reset();
          this.modalService.dismissAll();
          this.chargerIdPersonnel(this.id$);
          this.successmsg("Affectation créée", "L'affectation a été créée avec succès");
        },
        (error: any) => {
          const errors = error?.error?.errors ?? [];
          for (const currentError of errors) {
            this.toastService.error(`${currentError.champs}: ${currentError.message}`, 'Erreur!');
          }
        }
      );
    }
  }

  supprimerAffectation(id: number) {
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
        this.affectationService.supprimer(id).subscribe({
          next: () => {
            this.devisSbj.next(0);
            this.listeAffectationPersonnel = this.listeAffectationPersonnel.filter(i => i.id !== id);
            this.chargerIdPersonnel(this.id$);
            this.successmsg('Suppression réussie', 'Affectation supprimée');
          },
          error: (err: any) => {
            this.errormsg('Affectation non supprimée', err?.error?.message ?? 'Erreur');
          },
        });
      }
    });
  }

  openModalContratDetail(contrat: Contrat, content: any) {
    this.modalService.open(content);
    this.idContrat = contrat.id;
    this.chargerContratId();
    this.chargerListeAvenantContrat();
  }

  chargerContratId() {
    this.contratService.voirUnContratPersonnel(this.idContrat).subscribe((response: any) => {
      this.contrat = response
      const startDate = new Date(this.contrat?.dateDebut || new Date());
      const endDate = new Date(this.contrat?.dateFin || new Date());
      if (this.contrat) { this.contrat.duree = this.calculerDureeMission(startDate, endDate); }
    });
  }

  chargerListeAvenantContrat() {
    this.contratService.listerAvenantContrat(this.idContrat, this.currentPage, this.nombrePerPage, this.sort).subscribe(
      (response: any) => {
        this.listeAvenantContratPersonnel = response.body.content;
        this.totalAvenant = response.body.totalElements;
        this.totalPages = response.body.totalPages;
      }
    )
  }

  openModalAvenant(content: any, avenant: Avenant | undefined = undefined) {
    if (avenant) { this.formulaireAvenantContrat.patchValue(avenant as any) }
    else { this.formulaireAvenantContrat.reset() }
    this.modalService.open(content)
  }

  creeModifierAvenant() {
    const formData = new FormData();
    formData.append('file', this.file as File);
    formData.append('date', this.formulaireAvenantContrat.get('date')?.value?.toString() || '');
    formData.append('estActif', this.formulaireAvenantContrat.get('estActif')?.value?.toString() || 'false');
    // @ts-ignore
    formData.append('contrat', this.idContrat);
    if (this.formulaireAvenantContrat.valid)
      if (this.formulaireAvenantContrat.get('id')?.value) {
        this.avenantService.modifierAvenant(this.formulaireAvenantContrat.get("id")?.value, formData)
          .subscribe(
            (response: any) => {
              this.listeAvenantContratPersonnel.map(e => {
                if (e.id == response["data"].id) {
                  e.date = response["data"].date
                  e.estActif = response["data"].estActif
                }
                return e;
              })
              this.modalService.dismissAll()
              this.chargerIdPersonnel(this.id$)
              this.successmsg("Avenant modifié", "L'avenant a été modifié avec succès")
              this.formulaireAvenantContrat.reset()
            },
            (error) => {
              const errors = error.error.errors;
              for (let i = 0; i < errors.length; i++) {
                const currentError = errors[i];
                this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
              }
            }
          )
      } else {
        this.avenantService.creerAvenant(formData).subscribe(
          (response: any) => {
            this.listeAvenantContratPersonnel.unshift(response['data'])
            this.formulaireAvenantContrat.reset()
            this.modalService.dismissAll()
            this.chargerIdPersonnel(this.id$)
            this.successmsg("Avenant créé", "L'avenant a été ajouté au contrat avec succès")
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
  }

  supprimerAvenant(id: number) {
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
        this.avenantService.supprimerAvenant(id).subscribe({
          next: () => {
            this.devisSbj.next(0);
            this.listeAvenantContratPersonnel = this.listeAvenantContratPersonnel.filter((i) => i.id !== id);
            this.chargerIdPersonnel(this.id$)
            this.successmsg('Suppression réussie', 'Avenant supprimé');
          },
          error: (err) => {
            this.errormsg('Avenant non supprimé', err.error.message);
          },
        });
      }
    });
  }

  telechargerFicheAvenant(avenant: Avenant) {
    return `${this.avenantService.contextPath}/telecharger/` + avenant?.fichier;
  }
  showPopOnDownloadFicheAvenant() {
    this.successmsg('Ficher Avenant telechargé', "Le Ficher de l'Avenant a été bien téléchargé avec succès");
  }

  telechargerFicheDemande(demande: Demande) {
    return `${this.demandeService.contextPath}/telecharger/` + demande?.fichier;
  }
  showPopOnDownloadFicheDemande() {
    this.successmsg('Ficher Demande telechargé', "Le Ficher de la Demande a été bien téléchargé avec succès");
  }

  calculerDureeMission(startDate: Date, endDate: Date): string {
    const diffInMilliseconds = Math.abs(endDate.getTime() - startDate.getTime());
    const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    let duration = '';
    if (years > 0) { duration += years + ' an' + (years > 1 ? 's' : '') + ' '; }
    if (months > 0) { duration += months + ' mois '; }
    if (days > 0) { duration += days + ' jour' + (days > 1 ? 's' : ''); }

    return duration.trim();
  }

  activerAvenant(id: number) {
    Swal.fire({
      title: 'Êtes vous sûr ?',
      text: 'Êtes vous sûr de vouloir l\'activé. Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Activer le!',
      cancelButtonText: 'Non, Annuler',
    }).then((result) => {
      if (result.value) {
        this.avenantService.activerAvenant(id).subscribe({
          next: () => {
            this.chargerListeAvenantContrat()
            this.successmsg('Activation réussie', 'Avenant activé');
          },
          error: (err) => {
            this.errormsg('Avenant non activé', err.error.message);
          },
        });
      }
    });
  }
}

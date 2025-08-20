import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import Swal from "sweetalert2";
import {Observable, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {DataStateEnum} from "../../state/state";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {typeFonction} from "../models/utilisateur-authentifie";
import {GLOBAL_CONFIG} from "../../commun/models/global";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {AuthentificationService} from "../services/authentication.service";
import {NgbModal, NgbModalModule} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-connexion-pedago',
  templateUrl: './connexion-pedago.component.html',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    NgbModalModule,

  ],
  styleUrls: ['./connexion-pedago.component.scss']
})
export class ConnexionPedagoComponent implements OnInit {
  showLoginForm: boolean = false;
  showRegisterForm: boolean = false;
  public of =  GLOBAL_CONFIG.OF
  public entreprise =  GLOBAL_CONFIG.TITRE_ESPACE_CONNEXION_PEDAGOGIE

  loading: boolean = false; // Indicateur de chargement



  response !: Observable<any>;

  formulaire!: FormGroup;

  public listeFonction = Object.values(typeFonction);
  afficherInputs: boolean = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  formulaireDossierConnexion = new FormGroup({
    // id: new  FormControl(),
    email: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
    motdepasse: new FormControl('', [Validators.required]),
  })
  constructor(private router: Router,
              private authentificationService: AuthentificationService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
  ) {
    this.formulaire = this.formBuilder.group({
      lieuNaissance: [''],
      dateNaissance: [''],
      civilite: [''],
      dedesi: ['', ],
      telephone: ['',[Validators.required] ],

      fonction: [''],
      email: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      pays: ['', [Validators.required]],
      poste : [''],
      files: [null] // Pour les fichiers

    });
  }
  updatePoste(): void {
    const fonction = this.formulaire.get('fonction')?.value;
    if (fonction === typeFonction.Etudiant) {
      this.formulaire.get('poste')?.setValue('Etudiant');
      this.formulaire.get('poste')?.disable(); // Désactiver le champ poste

    } else if (fonction === typeFonction.Partenaire){
      this.formulaire.get('poste')?.setValue('');
      this.formulaire.get('poste')?.enable(); // Désactiver le champ poste

    }
  }


  ngOnInit(): void {
    this.showLoginForm = true;
    this.showRegisterForm = false;
    this.afficherInputs = false
  }

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
    this.showRegisterForm = false;
  }

  toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
    this.showLoginForm = false;
  }

  login(event: Event) {
    event.preventDefault(); // Empêche le formulaire de se soumettre

    // Afficher le modal de chargement
    this.openModal();

    // Simuler un délai de connexion
    setTimeout(() => {
      // Rediriger vers /pedagogie après la connexion
      this.router.navigateByUrl('/pedagogie');
    }, 2000); // 2 secondes
  }


  openModal() {
    Swal.fire({
      title: 'Connexion en cours...',
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 2000, // Durée de simulation de la connexion en millisecondes
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then(() => {
    });
  }


  onSubmitConnexion(): void {
    // Supposons que `this.formulaireDossierConnexion.value` ait une structure avec `email` et `motdepasse` comme propriétés.
    const { email, motdepasse } = this.formulaireDossierConnexion.value as { email: string; motdepasse: string };
    this.showLoadingModal();
    this.authentificationService.connexionPedago(email, motdepasse).subscribe(
      (data) => {
        console.log('après connexion ', data);
        if (data.dataState === DataStateEnum.ERREUR) {
          Swal.fire('Connexion échouée', data.errorMessage, 'error');
        } else {
          this.authentificationService.sauvegarderDansLaSession(data.token, data.email, data.permissions);
          this.successmsg('Connexion réussie', 'Vous êtes maintenant connecté.');

    //tion basée sur la valeur de data.fonction
          if (data.fonction === 'MINISTERE') {
            this.router.navigate(['/pedagogie/dossier-candidature']);
          } else if (data.fonction === 'ETUDIANT') {
            this.router.navigate(['/moncomptepedagogie/pre-inscription-etudiant']);

          } else {
            this.router.navigate(['/pedagogie/']);
          }
        }
      },
      (error: HttpErrorResponse) => {
        if (error.error && error.error.message) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur de connexion',
            text: error.error.message
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur de connexion',
            text: 'Une erreur s\'est produite lors de la connexion.'
          });
        }
      }
    );
  }


  selectedFiles: FileList | null = null;

  onFileChange(event: any) {
    this.selectedFiles = event.target.files;
  }

  onSubmit(): void {
    console.log("Les informations du formulaire ", this.formulaire.value);

    // Création du FormData pour les fichiers
    const formData = new FormData();
    formData.append('poste', this.formulaire.get('poste')?.value);
    formData.append('prenom', this.formulaire.get('prenom')?.value);
    formData.append('nom', this.formulaire.get('nom')?.value);
    formData.append('email', this.formulaire.get('email')?.value);
    formData.append('pays', this.formulaire.get('pays')?.value);
    formData.append('fonction', this.formulaire.get('fonction')?.value);
    formData.append('dateNaissance', this.formulaire.get('dateNaissance')?.value );
    formData.append('lieuNaissance', this.formulaire.get('lieuNaissance')?.value);
    formData.append('civilite', this.formulaire.get('civilite')?.value);
    formData.append('designation', this.formulaire.get('dedesi')?.value);
    formData.append('telephone', this.formulaire.get('telephone')?.value);

    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('files', this.selectedFiles[i]);
      }
    }

    this.showLoadingModalInscription();

    this.authentificationService.inscriptionPedagoNew(formData).subscribe(
      (data) => {
        if (data.dataState === DataStateEnum.ERREUR) {
          Swal.fire('Inscription échouée', data.errorMessage, 'error');
        } else {
          this.authentificationService.sauvegarderDansLaSession(data.token, data.email, data.permissions);
          this.successmsg('Inscription réussie', 'Veuillez consulter votre mail afin de pouvoir creer votre mot de passe de connexion.');
          this.toggleLoginForm()
          this.formulaire.reset();
          this.selectedFiles = null; // ou undefined

          this.formulaire = this.formBuilder.group({
            lieuNaissance: [''],
            dateNaissance: [''],
            civilite: [''],
            dedesi: ['', ],

            fonction: [typeFonction.Partenaire],
            email: ['', [Validators.required]],
            nom: ['', [Validators.required]],
            prenom: ['', [Validators.required]],
            pays: ['', [Validators.required]],
            poste : [''],
            files: [null] // Pour les fichiers

          });


        }
      },
      (error: HttpErrorResponse) => {
        if (error.error && error.error.message) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur d\'inscription',
            text: error.error.message
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur d\'inscription',
            text: 'Une erreur s\'est produite lors de l\'inscription.'
          });
        }
      }
    );
  }



  // Fonction pour ajouter des fichiers au formulaire
  // onFileChange(event): void {
  //   if (event.target.files.length > 0) {
  //     const files = event.target.files;
  //     this.formulaire.get('files').setValue(files);
  //   }
  // }

  showLoadingModal(): void {
    Swal.fire({
      title: 'Connexion en cours',
      html: 'Veuillez patienter...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  showLoadingModalInscription(): void {
    Swal.fire({
      title: 'Inscription en cours',
      html: 'Veuillez patienter...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

// Définir un type pour les paramètres 'title' et 'message'
  errormsg(title: string = 'Connexion échouée!', message: string) {
    Swal.fire(title, message, 'error');
  }

  successmsg(title: string = 'Connexion réussie!', message: string) {
    Swal.fire(title, message, 'success');
  }


  togglePasswordVisibility(): void {
    const passwordField = document.getElementById('loginPassword') as HTMLInputElement;
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
    } else {
      passwordField.type = 'password';
    }
  }

  openModalVisualiser(content: any) {
    this.modalService.open(content , {size:'xl'})
  }

  openModalVisualisers(content: any) {
    this.modalService.open(content , {size:'xl'})
  }
  protected readonly typeFonction = typeFonction;
}

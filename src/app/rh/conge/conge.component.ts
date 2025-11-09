import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {DataStateEnum, ModelDataState} from "../../state/state";
import {BehaviorSubject, Observable, of} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {catchError, map, startWith} from "rxjs/operators";
import Swal from "sweetalert2";
import {Personnel} from "../models/personnel";
import {PersonnelService} from "../services/personnel.service";
import {CongeService} from "../services/conge.service";
import {Conge} from "../models/conge";
// @ts-ignore
import Hashids from 'hashids'
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {Demande} from "../models/demande";
import { UtilisateurService } from '../../utilisateur/services/utilisateur.service';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-conge',
  templateUrl: './conge.component.html',
  styleUrls: ['./conge.component.scss']
})
export class CongeComponent implements OnInit {

  //Propriétés pour le composant ngx-extended-pdf-viewer pour telecharger debut
  showSidebarButton: boolean = false;
  showFindButton: boolean = false;
  showSecondaryToolbarButton: boolean = false;
  handTool: boolean = true;
  showDownloadButton: boolean = true;
  showPrintButton: boolean = false;
  contextMenuAllowed: boolean = false;
  showOpenFileButton: boolean = false;
  @ViewChild('contentVisualiser', { static: true }) contentVisualiser?: ElementRef;
    pdfUrl: string= "";
  // fin
  //pdfUrl: SafeResourceUrl | undefined;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
 
  pieces: File | null = null;
  items: any[] = [];
  dataStateEnum = DataStateEnum
  state?: DataStateEnum
  dossiers?: Observable<ModelDataState<Conge[]>>
  listeDossierPage: Conge[] = []
  conge ?: Conge ;
  listePersonnel: Personnel[] = []
  public nom:string = '';
  public searchValue: string = '';
  public loading:boolean=false;
  public id?:number;
  public idConge:number = 0;
  
formulaireDossier = new FormGroup({
  id: new  FormControl(),
  dateDebut: new FormControl(this.formatDate(new Date()), [Validators.required]), // Format yyyy-MM-dd
  nbreJour: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
  typeConge: new FormControl('Conge Annuel', [Validators.required]), // Valeur par défaut
  motif: new FormControl('', [Validators.required]), // Chaîne vide par défaut
  personnelId: new FormControl<number | null>(null, [Validators.required, Validators.pattern('^[0-9]*$')]), // Changé de personnel à personnelId
});

// Méthode pour formater la date en yyyy-MM-dd
private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

  totalDossier : number = 0;
  currentPage: number = 0;
  dossierPerPage: number = 10;
  sort: string = "desc";
  public pages: number[] = [];
  totalPages: number = 0;
  hashids : any
  devisSbj = new BehaviorSubject(0); // remove tab
  constructor(private dossierService: CongeService,
              private personnelService:PersonnelService,
              private utilisateurService: UtilisateurService ,
              private toastService:ToastrService,
              private modalService:NgbModal) { } //générer les messages
  ngOnInit(): void {
    this.hashids = new Hashids('mysecretkey');
    registerLocaleData(localeFr, 'fr');
    this.items = [
      {label: 'Ressources Humaines'},
      {label: 'Congés', active: true}
    ];
    this.chargerListeCongePage();

     this.utilisateurService.personnelNonUtilisateur().subscribe(x => {
      this.listePersonnel = x;
    });
  }


  chargerListeCongePage(): void {
   this.dossiers = this.dossierService
  .listerCongePage(this.currentPage, this.dossierPerPage, this.sort)
  .pipe(
    map((response: any) => {
      this.listeDossierPage = response.body.content;      // ✅ bien prendre body.content
      this.totalDossier    = response.body.totalElements;
      this.totalPages      = response.body.totalPages;
      this.pages           = this.getPages();
      return { dataState: this.dataStateEnum.CHARGE, data: this.listeDossierPage };
    }),
    startWith({ dataState: this.dataStateEnum.CHARGEMENT }),
    catchError(() => of({ dataState: this.dataStateEnum.ERREUR, data: [] }))
  );
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

 encodeId(id: number | undefined): string {
  if (id === undefined || id === null) {
    return this.hashids.encode(0); // ou une valeur par défaut
  }
  return this.hashids.encode(id);
}

  // onSearchPersonnel(nom: string){
  //   if(nom.length >= 3){
  //     this.personnelService.recherchePersonnel(nom).subscribe(
  //       (response : any) => {
  //         this.listePersonnel = response.body.content
  //       },(error)=>{
  //       }
  //     );
  //   }
  // }

onSearchPersonnel(nom: string){
  if(nom.length >= 3){
    this.loading = true;
    this.personnelService.recherchePersonnel(nom).subscribe(
      (response: any) => {
        console.log('Réponse API:', response);
        
        // La réponse est un tableau, on peut utiliser map directement
        this.listePersonnel = (response || []).map((personnel: any) => ({
          id: personnel.id,
          nom: personnel.nom,
          prenom: personnel.prenom,
          // Ajouter toutes les propriétés nécessaires pour l'affichage
          affichage: `${personnel.prenom || ''} ${personnel.nom || ''}`.trim(),
          // Conserver les autres propriétés si besoin
          etatCivil: personnel.etatCivil,
          posteGeneral: personnel.posteGeneral,
          fullName: personnel.fullName
        }));
        
        console.log(`${this.listePersonnel.length} personnel(s) trouvé(s)`);
        console.log('Liste personnel:', this.listePersonnel);
        this.loading = false;
      },
      (error) => {
        console.error('Erreur recherche personnel', error);
        this.listePersonnel = [];
        this.loading = false;
      }
    );
  }
}

 openModal(content: any, dossier: Conge | undefined = undefined) {
  if (dossier) {
    this.formulaireDossier.patchValue({
      id: dossier.id,
      dateDebut: this.formatDateForInput(dossier.dateDebut), // Format YYYY-MM-DD
      nbreJour: dossier.nbreJour,
      typeConge: dossier.typeConge,
      motif: dossier.motif,
      personnelId: dossier.personnel?.id // ← Changé de personnel à personnelId
    });
  } else {
    this.formulaireDossier.reset();
    this.formulaireDossier.get('typeConge')?.setValue('Conge Annuel'); // Valeur par défaut
  }
  
  this.modalService.open(content, {
    size: 'lg',
    backdrop: 'static',
    keyboard: false
  });
}

onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.pieces = file;
      console.log('Fichier sélectionné:', file.name);
    } else {
      this.pieces = null;
    }
  }

 resetFile(inputElement: HTMLInputElement): void {
    this.pieces = null;
    inputElement.value = ''; // Réinitialise la valeur du champ input
  }

  // Méthode alternative si vous préférez utiliser ViewChild
  resetFileWithViewChild(): void {
    this.pieces = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

private formatDateForInput(d?: string | Date | null): string {
  if (!d) return '';                      // rien → chaîne vide (OK pour <input type="date">)
  const s = typeof d === 'string' ? d.trim() : null;

  // déjà au format YYYY-MM-DD ?
  if (s && /^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // convertir string → Date si besoin
  const dt = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(dt.getTime())) return '';     // sécurité si invalide

  return dt.toISOString().slice(0, 10);   // YYYY-MM-DD
}


creeModifierConge() {
  let formData = new FormData();

  // Ajouter le fichier
  if (this.pieces) {
    formData.append('pieces', this.pieces);
  }

  // Récupérer les valeurs et les convertir en string (éviter null)
  const id = this.formulaireDossier.get('id')?.value || '';
  const dateDebut = this.formulaireDossier.get('dateDebut')?.value || '';
  const nbreJour = this.formulaireDossier.get('nbreJour')?.value || '';
  const typeConge = this.formulaireDossier.get('typeConge')?.value || '';
  const motif = this.formulaireDossier.get('motif')?.value || '';
  const personnelId = this.formulaireDossier.get('personnelId')?.value || '';

  // Ajouter les données au FormData (toujours en string)
  if (id) formData.append('id', id.toString());
  formData.append('dateDebut', dateDebut.toString());
  formData.append('nbreJour', nbreJour.toString());
  formData.append('typeConge', typeConge.toString());
  formData.append('motif', motif.toString());
  formData.append('personnelId', personnelId.toString());

  if (this.formulaireDossier.valid) {
    if (this.formulaireDossier.get('id')?.value) {
      // MODIFICATION
     // MODIFICATION
this.dossierService.modifierConge(this.formulaireDossier.get("id")?.value, formData)
  .subscribe(
    (updated: Conge) => {
      // enrichissement si personnel absent
      if (!updated.personnel && (updated as any).personnelId) {
        const p = this.listePersonnel.find(x => x.id === (updated as any).personnelId);
        if (p) {
          updated = {
            ...updated,
            personnel: {
              ...p,
              prenom: p?.etatCivil?.prenom ?? (p as any).prenom,
              nom:    p?.etatCivil?.nom    ?? (p as any).nom,
            } as any
          };
        }
      }

      this.listeDossierPage = this.listeDossierPage.map(e => e.id === updated.id ? { ...e, ...updated } : e);

      this.modalService.dismissAll();
      this.chargerListeCongePage(); // si tu veux rafraîchir la page
      this.successmsg("Congé modifié", "Le congé a été modifié avec succès");
      this.formulaireDossier.reset();
      this.pieces = null;
    },
    (error) => {
      this.errormsg('Erreur', error.error?.message || 'Erreur serveur');
      for (let k in (error.error?.errors || {})) {
        this.errormsg('Erreur', k + " " + error.error.errors[k]);
      }
    }
  );

    } else {
      // CRÉATION
      // CRÉATION
this.dossierService.creerConge(formData).subscribe(
  (created: Conge) => {
    // Si l’API ne renvoie pas le personnel peuplé, on enrichit localement
    if (!created.personnel && created.personnelId) {
      const p = this.listePersonnel.find(x => x.id === created.personnelId);
      if (p) {
        created = {
          ...created,
          personnel: {
            ...p,
            // compat: certains templates lisent conge.personnel.prenom/nom
            // alors que ton modèle affiche plutôt etatCivil.prenom/nom :
            prenom: p?.etatCivil?.prenom ?? (p as any).prenom,
            nom:    p?.etatCivil?.nom    ?? (p as any).nom,
          } as any
        };
      }
    }

    // Insérer l’objet **directement** (pas response['data'])
    this.listeDossierPage.unshift(created);

    // reset UI
    this.formulaireDossier.reset();
    this.pieces = null;
    this.modalService.dismissAll();
    this.successmsg("Congé créé", "Le congé a été créé avec succès");

    // Si tu préfères recharger depuis serveur pour être 100% synchro :
    // this.chargerListeCongePage();
  },
  (error) => {
    if (error.error?.errors?.length) {
      for (const e of error.error.errors) {
        this.toastService.error(`${e.champs}: ${e.message}`, 'Erreur!');
      }
    } else {
      this.toastService.error(error.error?.message || 'Erreur serveur', 'Erreur!');
    }
  }
);

    }
  }
}

// Méthode pour gérer les erreurs
private handleError(error: any): void {
  if (error.error?.errors) {
    const errors = error.error.errors;
    for (let i = 0; i < errors.length; i++) {
      const currentError = errors[i];
      this.toastService.error(currentError.champs + ": " + currentError.message, 'Erreur!');
    }
  } else if (error.error?.message) {
    this.toastService.error(error.error.message, 'Erreur!');
  } else {
    this.toastService.error('Erreur serveur', 'Erreur!');
  }
}

  closeModal() {
    this.modalService.dismissAll()
  }

  successmsg(title = 'Conge ajouter !', message = 'Vous venez d\'ajoutez avec succès un nouveau Conge !') {
    Swal.fire(title, message, 'success');
  }

  errormsg(title = 'Erreur !', message:string) {
    Swal.fire(title, message, 'error');
  }

supprimerDossier(id: number | undefined) {
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
    cancelButtonText: 'Non, Annuler',
  }).then((result) => {
    if (result.value) {
      this.dossierService.supprimerConge(id).subscribe({
        next: (value) => {
          this.devisSbj.next(0);
          this.listeDossierPage = this.listeDossierPage.filter(
            (i) => i.id !== id
          );
          this.successmsg('Suppression réussie', 'Congé supprimé');
        },
        error: (err) => {
          this.errormsg('Congé non supprimé', err.error.message);
        },
      });
    }
  });
}


  telechargerTitreConge(conge:Conge) {
    this.idConge = conge.id ?? 0;
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Êtes-vous sûr de vouloir télécharger le titre de congé ? Il vous sera impossible de revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, Télécharger le !',
      cancelButtonText:  'Non, Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onDownloadTitreConge();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // handle cancel action if necessary
      }
    }).catch((errors) => {
      this.toastService.error(errors.message, 'Titre de congé non télécharger');
      this.errormsg('Titre de congé non télécharger', errors.message);
    });
  }


  onDownloadTitreConge(): void {
    this.dossierService.telechargerTitreConge(this.idConge).subscribe(
      (data) => {
        const currentDate = new Date();
        const fileName = `titre_de_conge_${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}_${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}.pdf`;
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        this.successmsg('Générer titre de conge réussie', 'Le titre de cet  congé a été générer et télécharger avec succès');
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


  openModalDetailConge(conge: Conge, content:any) {
    this.openModal(content);
    this.idConge = conge.id ?? 0;
    this.chargerCongeId();
  }

  chargerCongeId() {
    this.dossierService
      .voirConge(this.idConge)
      .subscribe((response) => {
        this.conge = response
      });
  }

}

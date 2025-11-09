import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DataStateEnum, ModelDataState} from "../../state/state";
import {ToastrService} from "ngx-toastr";
import {AuthentificationService} from "../../authentification/services/authentication.service";
import {DomSanitizer, Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {AsyncPipe, DatePipe, DOCUMENT, NgIf, NgSwitch, NgSwitchCase, registerLocaleData} from "@angular/common";
import {Observable} from "rxjs";
import { UtilisateurAuthentifie } from '../../authentification/models/utilisateur-authentifie';

@Component({
  selector: 'app-entetedepagepedagogie',
  standalone: true,
  imports: [
    NgIf,
    NgSwitchCase,
    NgSwitch,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './entetedepagepedagogie.component.html',
  styleUrl: './entetedepagepedagogie.component.scss'
})
export class EntetedepagepedagogieComponent implements OnInit {
  dataStateEnum = DataStateEnum;

  websock : any
  url: any;
  element;
  cookieValue;
  flagvalue;
  countryName;
  valueset;
  private socket$: WebSocketSubject<any>;

  requerantId: any
  requerant: any
  requerantFonction: any

  profilSrc = null;
  notifications: any[] = []; // Assurez-vous de définir correctement le type des notifications
  personnelId: number;
  //
  utilisateurAuthentifie: any;
  utilisateurAuthentifieState$: Observable<ModelDataState<UtilisateurAuthentifie>>;

  constructor(@Inject(DOCUMENT) private document: any, private router: Router,
              private titleService: Title,
              public translate: TranslateService,
              private pedagogieService: PedagogieService,
              public _cookiesService: CookieService,
              private authenficationSerice: AuthentificationService,
              private sanitizer: DomSanitizer,
              private notificationService: NotificationService,
              private webSocketService: WebsocketService,
              private toastr: ToastrService
  ) {
    this.requerant = null
    this.obtenirUnUtilisateurParEmail();
    // this.onSearchRequerantEmail();

  }


  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  openMobileMenu: boolean;
  totalNotificationCount: number = 0;
  totalNotificationCountUnread: number = 0;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();
  allNotifications: any[] = [];
  private isWebSocketConnected: boolean = false;
  private tryToConnectWebSocket: boolean = true;

  ngOnInit() {
    registerLocaleData(localeFr, 'fr');
    this.openMobileMenu = false;
    this.element = document.documentElement;

    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
    this.pedagogieService.rechercheRequerantParEmail(sessionStorage.getItem("email")).subscribe(
      (response : any) => {
        this.requerant = response.body;
      },
      (error)=>{
        // Gérez les erreurs ici
        //console.log("Erreur pour la recuperation du requerant  ", error)
      }
    );
    this.connectToWebSocket();
    // this.updatePageTitle(this.notifications.length);
    this.updatePageTitle(this.totalNotificationCount);
    // this.fetchNotifications();
  }

  private connectToWebSocket() {
    const socket = this.webSocketService.connect(); // Établir la connexion WebSocket

    socket.subscribe(
      (message) => {
        // Gestion des messages WebSocket
        this.websock = message;
        if( this.websock.content === 'Connexion réussie') {

        } else  {
          this.toastr.success(`Message: ${this.websock.content}`, 'Notifications', {
            timeOut: 10000, // Durée d'affichage de la notification en millisecondes
            closeButton: true, // Bouton de fermeture
            progressBar: true // Barre de progression
          });
          this.fetchNotificationsUnread(this.personnelId); // Met à jour les notifications lorsqu'un message est reçu
          this.playNotificationSound();

        }

        // Traitez les messages reçus du serveur WebSocket ici
        console.log('Received message:', message);
        // Mettez à jour les notifications après avoir reçu un message WebSocket
        // this.fetchNotifications(this.personnelId); // Remplacez 'yourUserId' par l'ID du personnel approprié
      },
      (error) => {
        console.error('WebSocket error:', error);
        // Reconnecter après une déconnexion
        this.isWebSocketConnected = false;
        this.scheduleReconnect();
      },
      () => {
        console.log('WebSocket connection closed.');
        // Reconnecter après une déconnexion
        this.isWebSocketConnected = false;
        this.scheduleReconnect();
      }
    );

    // Envoyer un message "auth" après l'établissement de la connexion WebSocket
    const token = sessionStorage.getItem('token');
    socket.next({ type: 'auth', token: token });
  }


  private scheduleReconnect() {
    if (!this.isWebSocketConnected && this.tryToConnectWebSocket) { // Vérifier si la connexion WebSocket est fermée
      setTimeout(() => {
        console.log('Trying to reconnect...');
        this.connectToWebSocket(); // Appeler la fonction de connexion au WebSocket pour tenter une reconnexion
      }, 10000); // Réessayer la connexion toutes les 30 secondes
    } else {
    }
  }


  playNotificationSound() {
    // Créer un nouvel élément audio
    const audio = new Audio('/assets/son.mp3');

    // Jouer le son
    audio.play()
      .then(() => {
        // La lecture du son a réussi
        console.log('Notification sound played successfully.');
      })
      .catch((error) => {
        // La lecture du son a échoué
        console.error('Error playing notification sound:', error);
      });
  }

  fetchNotifications(id: number): void {
    this.notificationService.listeNotification(id).subscribe(
      (data) => {
        // Ajoutez les nouvelles notifications à la variable allNotifications
        this.allNotifications.unshift(...data.reverse());
        // Mettez à jour le badge de la cloche et le titre de l'onglet
        // this.totalNotificationCount += data.length;
        this.fetchNotificationsUnread(id);
        this.updatePageTitle(this.totalNotificationCountUnread);
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des notifications : ', error);
      }
    );
  }

  fetchNotificationsUnread(id: number): void {
    this.notificationService.listeNotificationUnread(id).subscribe(
      (data) => {
        this.totalNotificationCountUnread = data;
        this.updatePageTitle(this.totalNotificationCountUnread);

      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des notifications : ', error);
      }
    );
  }

  getNotificationLink(notification: any): string {
    switch(notification.type) {
      //INTERIM personnel
      case 'Intérim':
        return '/moncompte/mes-interims';


      //AFFECTATION personnel
      case 'Affectation modifiée':
        return '/moncompte/mes-affectations';


      //MISSION
      case 'Demande d\'ordre de mission':
        return '/moncompte/mes-missions';
      //Mission chef
      case 'Mission à valider':
        return '/moncompte/demandeService';
      //Autre
      case 'Mission à approuver':
        return '/moncompte/missions-a-valider';


      //ABSENCE //demandeur
      case 'Demande d\'absence':
        return '/moncompte/demande';
      // chef
      case 'Demande d\'absence à valider':
        return '/moncompte/demandeService';
      // autre
      case 'Demande d\'absence à approuver':
        return '/moncompte/absence-a-valider';

      //CONGE //demandeur
      case 'Demande de congé':
        return '/moncompte/demande-conge';
      //Chef
      case 'Demande de congé à valider':
        return '/moncompte/demandeService';
      //autre
      case 'Demande de congé à approuver':
        return '/moncompte/conge-a-valider';

      //ADMINISTRATIF //demandeur
      case 'Demande d\'acte administratif':
        return '/moncompte/demande-acte-admin';
      //autre
      case 'Demande d\'acte administratif à approuver':
        return '/moncompte/acte-administratif-a-valider';
      // Ajoutez d'autres cas selon vos besoins
    }
  }


  updatePageTitle(notificationCount: number): void {
    if (notificationCount > 0) {
      this.titleService.setTitle(` (${notificationCount}) Vous avez des notifications`);
    } else {
      this.titleService.setTitle('Plateforme intégré de gestion des ressources humaines et de la formation de l\`ISI');
    }
  }


//test
  creationImage(image: Blob) {
    if (image && image.size > 0) {
      /*
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.imageToShow = reader.result;
        this.showSpinner = false;
      }, false);
      reader.readAsDataURL(image);
      */
      //this.profilSrc = window.URL.createObjectURL(image);
      //alert(this.profilSrc.);

      let objectURL = URL.createObjectURL(image);
      this.profilSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    } else {
      //this.showSpinner = false;
    }
  }


  afficherImageDeProfil(image_de_profil: string) {
    this.authenficationSerice.recuperationDeImageDeProfilPedago(image_de_profil).subscribe(data => {
        this.creationImage(data);
      }, error => {
        //alert(error);
      }
    );
  }

  // Permissions Pour les menus de l'espace de travail
  aPermission(permission: string): boolean {
    return this.utilisateurAuthentifie && this.utilisateurAuthentifie.role &&
      this.utilisateurAuthentifie.role.some(role =>
        role.permissions && role.permissions.some(p => p.code === permission)
      );
  }

  obtenirUnUtilisateurParEmail() {
    this.utilisateurAuthentifieState$ = this.authenficationSerice.obtenirUnUtilisateurParEmailPedagogie(sessionStorage.getItem("email")).pipe(
      map(data => {

        //console.log(data);
        this.utilisateurAuthentifie = data;
        //console.log(this.utilisateurAuthentifie.image_de_profil);
        // this.personnelId = this.utilisateurAuthentifie.personnel.rhPersonnel
        // this.fetchNotificationsUnread(this.personnelId)
        this.afficherImageDeProfil(this.utilisateurAuthentifie.imageProfil);

        return { data: data, dataState: DataStateEnum.CHARGE };
      }),
      startWith({ dataState: DataStateEnum.CHARGEMENT }),
      catchError((error: HttpErrorResponse) => {
        return this.authenficationSerice.gestionnaireDerreur(error);
      }),
      //catchError(error => of({ dataState: DataStateEnum.ERREUR, errorMessage: error.error.message, errorStatus: error.status })),
    );

  }

  onSearchRequerantEmail(){
    this.pedagogieService.rechercheRequerantParEmail(sessionStorage.getItem("email")).subscribe(
      (response : any) => {
        this.requerant = response.body;
      },
      (error)=>{
        // Gérez les erreurs ici
        //console.log("Erreur pour la recuperation du requerant  ", error)
      }
    );
  }



  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Déconnexion
   */
  deconnexion() {
    this.tryToConnectWebSocket = false
    this.webSocketService.disconnect(); // A
    // this.so
    // Gérer l'événement de fermeture WebSocket

    this.authenficationSerice.deconnexionPedagogie();
  }


  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
}

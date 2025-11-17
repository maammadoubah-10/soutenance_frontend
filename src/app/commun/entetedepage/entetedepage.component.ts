// src/app/commun/entetedepage/entetedepage.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  Output,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { map, catchError, startWith, takeUntil } from 'rxjs/operators';
import { interval, Observable, Subject } from 'rxjs';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { WebsocketService } from '../services/websocket.service';
import { DataStateEnum, ModelDataState } from '../../state/state';
import { UtilisateurAuthentifie } from '../../authentification/models/utilisateur-authentifie';
import { AuthentificationService } from '../../authentification/services/authentication.service';
import { environment } from '../../../environments/environment';

import { NotificationApiService } from '../../services/notification-api.service';
import { NotificationModel } from '../../models/notification.dto';

import { CurrentUserStore } from '../../store/current-user.store';

@Component({
  selector: 'app-entetedepage',
  templateUrl: './entetedepage.component.html',
  styleUrls: ['./entetedepage.component.scss']
})
export class EntetedepageComponent implements OnInit, OnDestroy {
  dataStateEnum = DataStateEnum;

  element: any;
  cookieValue: any;
  flagvalue: any;
  countryName: any;
  valueset: any;

  profilSrc: SafeUrl | null = null;
  notifications: NotificationModel[] = [];
  personnelId!: number;

  utilisateurAuthentifie: any;
  utilisateurAuthentifieState$!: Observable<ModelDataState<UtilisateurAuthentifie>>;

  totalNotificationCountUnread = 0;

  private destroy$ = new Subject<void>();
  private ngUnsubscribe = new Subject<boolean>();
  private boundUserId: string | null = null;

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  openMobileMenu = false;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  private tryToConnectWebSocket = true;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    private titleService: Title,
    public translate: TranslateService,
    private notifApi: NotificationApiService,
    private userStore: CurrentUserStore,
    private authenficationSerice: AuthentificationService,
    private sanitizer: DomSanitizer,
    private webSocketService: WebsocketService,
    private toastr: ToastrService,
    private httClient: HttpClient
  ) {
    // Charge l’utilisateur dès le constructeur
    this.obtenirUnUtilisateurParEmail();

    // Vérification périodique du token
    this.verificationTokenValidationParMinute();
  }

  ngOnInit(): void {
    this.openMobileMenu = false;
    this.element = document.documentElement;

    const user = this.userStore.value;
    if (user) {
      this.utilisateurAuthentifie = this.utilisateurAuthentifie ?? user;
    }

    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.valueset = 'assets/images/flags/us.jpg';
      }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }

    // init notifs + websocket quand possible
    this.initNotificationsAndWebSocket();

    this.updatePageTitle(this.totalNotificationCountUnread);
  }

  /**
   * Initialise le compteur de notifications + WebSocket
   * dès qu'on a un personnelId valide.
   */
  private initNotificationsAndWebSocket(): void {
    const pid = this.getCurrentPersonnelId();

    if (!pid) {
      console.warn('[ENTETE] initNotificationsAndWebSocket: aucun personnelId → pas de WS pour l’instant.');
      return;
    }

    if (this.boundUserId === String(pid)) {
      return;
    }
    this.boundUserId = String(pid);

    console.log('[ENTETE] Initialisation notifications + WS pour personnelId =', pid);

    this.refreshUnreadCount();

    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshUnreadCount());

    this.webSocketService.connect(pid);

    this.webSocketService
      .onMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((msg: any) => {
        console.log('[WS][ENTETE] message reçu :', msg);

        if (msg?.type === 'NOTIF') {
          this.toastr.success(msg.message, 'Notification', {
            timeOut: 8000,
            progressBar: true,
            closeButton: true
          });

          this.refreshUnreadCount();
          this.playNotificationSound();
        }
      });
  }

  // Utilise NotificationApiService (nouveau backend)
  refreshUnreadCount(): void {
    const pid = this.getCurrentPersonnelId();
    if (!pid) return;

    this.notifApi.unreadCount(pid).subscribe({
      next: (c: number) => {
        this.totalNotificationCountUnread = c;
        this.updatePageTitle(c);
      },
      error: () => {}
    });
  }

  private getCurrentUserEmail(): string | null {
    return this.userStore.value?.email
      || this.utilisateurAuthentifie?.personnel?.etatCivil?.email
      || this.utilisateurAuthentifie?.personnel?.email
      || this.utilisateurAuthentifie?.email
      || null;
  }

  onNotificationClick(event: MouseEvent, n: NotificationModel): void {
    event.preventDefault();
    this.notifApi.markRead(n.id).subscribe({
      next: () => this.refreshUnreadCount(),
      error: () => {}
    });
    if (n.link) {
      window.location.href = n.link;
    }
  }

  private getCurrentPersonnelId(): number | null {
    return this.userStore.value?.personnelId
      ?? this.utilisateurAuthentifie?.personnel?.id
      ?? this.utilisateurAuthentifie?.personnel?.rhPersonnel
      ?? null;
  }

  getNotificationLink(n: NotificationModel): string {
    if (n.link && n.link.startsWith('mailto:')) return n.link;
    const to = this.getCurrentUserEmail() ?? '';
    const subject = encodeURIComponent(n.title || n.type || 'Notification');
    const body = encodeURIComponent(
      `${n.message}\n\nEnvoyée le: ${new Date(n.createdAt).toLocaleString()}`
    );
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }

  obtenirLeToken(): string | null {
    return sessionStorage.getItem('token');
  }

  verificationTokenValidationParMinute(): void {
    const tokenCheckInterval$ = interval(60000);
    tokenCheckInterval$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.validateToken();
      });
  }

  validateToken(): void {
    const token = this.obtenirLeToken();
    if (!token) {
      this.deconnexion();
      return;
    }

    const base = environment.hostmicroservicepersonnel; // ex : "http://localhost:9002/rh/"
    const url = `${base}auth/validateToken`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.httClient.get<any>(url, { headers }).subscribe({
      next: (response) => {
        const isValid = !!response?.valid;
        if (!isValid) {
          this.toastr.error(
            'Vous avez été déconnecté : votre session a expiré. Veuillez vous reconnecter.'
          );
          this.deconnexion();
        }
      },
      error: (err) => {
        console.error('Erreur lors de la validation du token :', err);
        // éventuellement : this.deconnexion();
      },
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();

    this.destroy$.next();
    this.destroy$.complete();
  }

  playNotificationSound(): void {
    const audio = new Audio('/assets/son.mp3');
    audio.play()
      .then(() => {
        console.log('Notification sound played successfully.');
      })
      .catch((error) => {
        console.error('Error playing notification sound:', error);
      });
  }

  updatePageTitle(notificationCount: number): void {
    if (notificationCount > 0) {
      this.titleService.setTitle(` (${notificationCount}) Vous avez des notifications`);
    } else {
      this.titleService.setTitle(
        'Plateforme intégré de gestion des ressources humaines et de la formation de l`ISI'
      );
    }
  }

  creationImage(image: Blob): void {
    if (image && image.size > 0) {
      const objectURL = URL.createObjectURL(image);
      this.profilSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }
  }

  obtenirUnUtilisateurParEmail(): void {
    const email = sessionStorage.getItem('email');
    if (!email) {
      console.error('Email not found in session storage');
      return;
    }

    this.utilisateurAuthentifieState$ = this.authenficationSerice
      .obtenirUnUtilisateurParEmail(email)
      .pipe(
        map((data) => {
          this.utilisateurAuthentifie = data;

          const pid =
            data?.personnelId ??
            data?.personnel?.rhPersonnel ??
            data?.personnel?.id ??
            null;

          this.personnelId = pid ?? 0;

          this.userStore.set({
            id: data.id,
            email: data.personnel?.etatCivil?.email ?? email,
            personnelId: pid,
          });

          this.refreshUnreadCount();
          this.initNotificationsAndWebSocket();

          return { data: data, dataState: DataStateEnum.CHARGE };
        }),
        startWith({ dataState: DataStateEnum.CHARGEMENT }),
        catchError((error: HttpErrorResponse) => {
          return this.authenficationSerice.gestionnaireDerreur(error);
        })
      );
  }

  onSearchRequerantEmail(): void {
    const email = sessionStorage.getItem('email');
    if (!email) {
      console.error('Email not found in session storage');
      return;
    }
    // à compléter si nécessaire
  }

  setLanguage(text: string, lang: string, flag: string): void {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
  }

  toggleRightSidebar(): void {
    this.settingsButtonClicked.emit();
  }

  toggleMobileMenu(event: any): void {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  deconnexion(): void {
    this.tryToConnectWebSocket = false;
    this.webSocketService.disconnect();
    this.authenficationSerice.deconnexion();
  }

  fullscreen(): void {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        this.document.msExitFullscreen();
      }
    }
  }
}

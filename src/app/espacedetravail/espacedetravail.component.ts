import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

import { Router, NavigationEnd } from '@angular/router';
import { EventService } from '../commun/services/event.service';
import { DataStateEnum, ModelDataState } from '../state/state';
import moment from 'moment';
import { map, catchError, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilisateurAuthentifie } from '../authentification/models/utilisateur-authentifie';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AuthentificationService } from '../authentification/services/authentication.service';

export const SIDEBAR_TYPE = 'red';

@Component({
  selector: 'app-espacedetravail',
  templateUrl: './espacedetravail.component.html',
  styleUrls: ['./espacedetravail.component.scss']
})
export class EspacedetravailComponent implements OnInit, AfterViewInit, OnDestroy {

  year: number = new Date().getFullYear();

  isHolidayToday: boolean = false;
  isHolidayTomorrow: boolean = false;
  holidayNameTomorrow: string = '';
  isNextDayHoliday: boolean = false;
  holidayNameNextDay: string = '';
  isRegularDay: boolean = false;
  motivationMessage: string = '';

  profilSrc: SafeUrl | null = null;
  email: string | null = null;

  items?: Array<{}>;
  dataStateEnum = DataStateEnum;

  isCondensed = false;
  sidebartype: string = '';

  utilisateurAuthentifie: any = null;
  utilisateurAuthentifieState$?: Observable<ModelDataState<UtilisateurAuthentifie>>;

  constructor(
    private router: Router,
    private eventService: EventService,
    private authenficationSerice: AuthentificationService,
    private sanitizer: DomSanitizer
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        document.body.classList.remove('sidebar-enable');
      }
    });

    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');
    const tomorrow = moment().add(1, 'day').startOf('day');
    const nextDay = moment().add(2, 'day').startOf('day');
    const holidays = this.getBeninHolidays();

    if (holidays.some(holiday => holiday.isSame(today, 'day'))) {
      this.isHolidayToday = true;
    }

    if (holidays.some(holiday => holiday.isSame(tomorrow, 'day'))) {
      this.isHolidayTomorrow = true;
      this.holidayNameTomorrow = this.getHolidayName(tomorrow);
    }

    if (holidays.some(holiday => holiday.isSame(nextDay, 'day'))) {
      this.isNextDayHoliday = true;
      this.holidayNameNextDay = this.getHolidayName(nextDay);
    }

    if (!this.isHolidayToday && !this.isHolidayTomorrow && !this.isNextDayHoliday) {
      this.isRegularDay = true;
      this.motivationMessage = this.getRandomMotivationMessage();
    }

    if (this.isHolidayTomorrow && yesterday.isSame(holidays[0], 'day')) {
      console.log(
        `Demain est férié ! N'oubliez pas de vous reposer et de célébrer ${this.holidayNameTomorrow} ! 🎉`
      );
    }

    if (this.isNextDayHoliday && tomorrow.isSame(holidays[0], 'day')) {
      console.log(
        `Le jour suivant est férié ! Profitez de votre journée de repos et de la célébration de ${this.holidayNameNextDay} ! 🎉`
      );
    }

    if (this.isRegularDay) {
      console.log("Il n'y a pas de jour férié prévu. " + this.motivationMessage);
    }
  }

   greeting = '';
  today: Date = new Date();
  now: Date = new Date();           // ➜ utilisé dans le template {{ now | date:'HH:mm:ss' }}
  private clockSub?: Subscription;  // ➜ pour le timer en temps réel


  quickLinks = [
    { label: 'Utilisateurs', route: '/utilisateur', icon: 'bx bx-user-circle' },
    { label: 'Ressources Humaines', route: '/rh', icon: 'bx bx-id-card' },
    { label: 'Gestion de la Paie', route: '/paie', icon: 'bx bx-wallet' },
    { label: 'Formation Interne', route: '/personnel', icon: 'bx bx-book-open' },
  ];

  kpis = [
    { label: 'Présences (mois)', value: '—' },
    { label: 'Congés actifs', value: '—' },
    { label: 'Variables Paie', value: '—' },
    { label: 'Demandes ouvertes', value: '—' },
  ];

  features = [
    {
      title: 'Ressources Humaines',
      text: 'Suivi des présences, validations, congés et dossiers.',
      image: '/assets/home/feature-rh.jpg',
      route: '/rh',
    },
    {
      title: 'Gestion de la Paie',
      text: 'Variables, bulletins et contrôles qualité.',
      image: '/assets/home/feature-paie.jpg',
      route: '/paie',
    },
    {
      title: 'Formation Interne',
      text: 'Plan, sessions, présence & évaluations.',
      image: '/assets/home/feature-formation.jpg',
      route: '/personnel',
    },
  ];

  gallery = [
    '/assets/home/g1.jpg',
    '/assets/home/g2.jpg',
    '/assets/home/g3.jpg',
    '/assets/home/g4.jpg',
    '/assets/home/g5.jpg',
    '/assets/home/g6.jpg',
  ];

  testimonials = [
    { name: 'A. Kouassi', role: 'RH', text: 'Une page d’accueil claire et rapide au quotidien.', avatar: '/assets/home/av1.jpg' },
    { name: 'S. Hountondji', role: 'Compta', text: 'Les accès rapides me font gagner du temps.', avatar: '/assets/home/av2.jpg' },
    { name: 'M. Sagna', role: 'DSI', text: 'Design propre, navigation fluide, top.', avatar: '/assets/home/av3.jpg' },
    { name: 'I. Dossa', role: 'Paie', text: 'Enfin une vue d’ensemble utile !', avatar: '/assets/home/av4.jpg' },
  ];

  news = [
    { title: 'Mise à jour RH', excerpt: 'Nouvelles règles de validation…', image: '/assets/home/n1.jpg', date: new Date(), route: '/publication' },
    { title: 'Paie — clôture', excerpt: 'La clôture du mois aura lieu…', image: '/assets/home/n2.jpg', date: new Date(), route: '/publication' },
    { title: 'Sécurité', excerpt: 'Renforcez vos mots de passe…', image: '/assets/home/n3.jpg', date: new Date(), route: '/publication' },
    { title: 'Formation Excel', excerpt: 'Nouvelle session le 15…', image: '/assets/home/n4.jpg', date: new Date(), route: '/publication' },
  ];

  heroStats = [
    { label: 'Dernière connexion', value: new Date().toLocaleDateString('fr-FR'), icon: 'bx bx-time-five' },
    { label: 'Aujourd’hui', value: new Date().toLocaleDateString('fr-FR', { weekday: 'long' }), icon: 'bx bx-calendar-event' },
    { label: 'Statut', value: '—', icon: 'bx bx-bell' },
    { label: 'Profil', value: 'Complet', icon: 'bx bx-user-check' },
  ];

  annonces = [
    { title: 'Bienvenue', text: 'Découvrez la nouvelle page d’accueil.', cta: { label: 'En savoir +', route: '/publication' } },
    { title: 'Support', text: 'Un souci ? Le centre d’aide est là.', cta: { label: 'Centre d’aide', route: '/moncompte/parametre' } },
    { title: 'Paie', text: 'Clôture du mois courant dans 5 jours.' },
  ];

  ngOnInit() {
    registerLocaleData(localeFr, 'fr');
    this.items = [{ label: 'Espace de travail ' }, { label: 'Logiciels', active: true }];

    this.obtenirUnUtilisateurParEmail();

    this.sidebartype = SIDEBAR_TYPE;
    const h = new Date().getHours();
    this.greeting = h < 12 ? 'Bonjour' : (h < 18 ? 'Bon après-midi' : 'Bonsoir');

    this.heroStats = this.heroStats.map(s =>
      s.label === 'Statut'
        ? {
            ...s,
            value: this.isHolidayToday
              ? 'Jour férié 🎉'
              : this.isHolidayTomorrow
              ? 'Férié demain'
              : 'Journée ouvrée',
          }
        : s
    );
  
    document.body.setAttribute('data-layout', 'vertical');
        // Horloge temps réel
    this.clockSub = interval(1000).subscribe(() => {
      this.now = new Date();
    });

    // ⚠️ NE PAS ACCÉDER À this.utilisateurAuthentifie ICI : il n’est pas encore chargé
  }

    ngOnDestroy(): void {
    this.clockSub?.unsubscribe();
  }


  creationImage(image: Blob) {
    if (image && image.size > 0) {
      const objectURL = URL.createObjectURL(image);
      this.profilSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }
  }

  afficherImageDeProfil(image_de_profil?: string): void {
    if (!image_de_profil) return;

    const obs = this.authenficationSerice.recuperationDeImageDeProfil(image_de_profil);
    if (!obs) return;

    obs.subscribe({
      next: (blob: Blob) => this.creationImage(blob),
      error: () => {
        // gestion erreur image si besoin
      },
    });
  }

  obtenirUnUtilisateurParEmail() {
    const email = sessionStorage.getItem('email') ?? '';
    console.log('utilisateur connecter ', email);

    this.utilisateurAuthentifieState$ = this.authenficationSerice
      .obtenirUnUtilisateurParEmail(email)
      .pipe(
        map((data) => {
          this.utilisateurAuthentifie = data;
          this.email = data?.email ?? null;

          // log safe (optionnel)
          console.log(
            'utilisateurAuthentifie chargé :',
            this.utilisateurAuthentifie
          );

          this.afficherImageDeProfil((data as any)?.image_de_profil);

          return { data, dataState: DataStateEnum.CHARGE };
        }),
        startWith({ dataState: DataStateEnum.CHARGEMENT }),
        catchError((error: HttpErrorResponse) =>
          this.authenficationSerice.gestionnaireDerreur(error)
        )
      );
  }

  isMobile() {
    const ua = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);
  }

  ngAfterViewInit() {}

  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

  onToggleMobileMenu() {
    this.isCondensed = !this.isCondensed;
    document.body.classList.toggle('sidebar-enable');
    document.body.classList.toggle('vertical-collpsed');

    if (window.screen.width <= 768) {
      document.body.classList.remove('vertical-collpsed');
    }
  }

  deconnexion() {
    this.authenficationSerice.deconnexion();
  }

  getBeninHolidays(): moment.Moment[] {
    const year = moment().year();
    const holidays: moment.Moment[] = [];

    holidays.push(moment(`${year}-01-01`)); // Nouvel An
    holidays.push(moment(`${year}-01-10`)); // Fête du Vodoun
    holidays.push(moment(`${year}-04-10`)); // Lundi de Pâques
    holidays.push(moment(`${year}-04-21`)); // Aïd El Fitr
    holidays.push(moment(`${year}-05-01`)); // Fête du Travail
    holidays.push(moment(`${year}-05-18`)); // Fête de l'Ascension
    holidays.push(moment(`${year}-05-29`)); // Lundi de Pentecôte
    holidays.push(moment(`${year}-06-18`)); // Fête des pères
    holidays.push(moment(`${year}-06-29`)); // Fête de la Tabaski
    holidays.push(moment(`${year}-08-01`)); // Fête de l'Indépendance
    holidays.push(moment(`${year}-08-15`)); // Fête de l'Assomption et de l'Igname
    holidays.push(moment(`${year}-09-27`)); // Fête de la Maouloud
    holidays.push(moment(`${year}-11-01`)); // Fête de la Toussaint
    holidays.push(moment(`${year}-12-25`)); // Fête de Noël

    return holidays;
  }

  getHolidayName(date: moment.Moment): string {
    const holidayNames: Record<string, string> = {
      '01-01': 'Nouvel An',
      '01-10': 'Fête du Vodoun',
      '04-10': 'Lundi de Pâques',
      '04-21': 'Aïd El Fitr',
      '05-01': 'Fête du Travail',
      '05-18': "Fête de l'Ascension",
      '05-29': 'Lundi de Pentecôte',
      '06-18': 'Fête des pères',
      '06-29': 'Fête de la Tabaski',
      '08-01': "Fête de l'Indépendance",
      '08-15': "Fête de l'Assomption et de l'Igname",
      '09-27': 'Fête de la Maouloud',
      '11-01': 'Fête de la Toussaint',
      '12-25': 'Fête de Noël',
    };

    const formattedDate = date.format('MM-DD');
    return holidayNames[formattedDate] || '';
  }

  getRandomMotivationMessage(): string {
    const motivationMessages = [
      "Restez motivé et continuez votre excellent travail ! ",
      "Chaque petit pas compte. Continuez à avancer vers vos objectifs ! ",
      // … (toutes tes phrases de motivation, inchangées)
      "Le succès est le résultat d'un travail acharné, d'une vision claire et de la volonté de persévérer lorsque les temps sont difficiles. Gardez votre vision vivante, restez motivé et les portes s'ouvriront devant vous ! ",
      "Le succès est un voyage personnel. Ce qui compte, c'est le progrès que vous réalisez chaque jour et la personne que vous devenez tout au long de votre parcours. Profitez de l'aventure et appréciez le processus ! ",
      "La clé pour atteindre vos objectifs est de vous entourer de personnes qui vous encouragent, vous soutiennent et croient en vous. Votre environnement peut avoir un impact énorme sur votre réussite, alors choisissez judicieusement vos compagnons de route ! ",
    ];

    const randomIndex = Math.floor(Math.random() * motivationMessages.length);
    return motivationMessages[randomIndex];
  }
}

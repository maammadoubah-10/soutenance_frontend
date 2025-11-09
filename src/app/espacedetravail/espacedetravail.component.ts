import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit , AfterViewInit} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { EventService } from '../commun/services/event.service';
import { DataStateEnum, ModelDataState } from '../state/state';
import moment from 'moment';
import { map, catchError, startWith, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UtilisateurAuthentifie } from '../authentification/models/utilisateur-authentifie';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { AuthentificationService } from '../authentification/services/authentication.service';
export const SIDEBAR_TYPE = 'red';
//export const TOPBAR = 'dark';

@Component({
  selector: 'app-espacedetravail',
  templateUrl: './espacedetravail.component.html',
  styleUrls: ['./espacedetravail.component.scss']
})


export class EspacedetravailComponent implements OnInit , AfterViewInit{
  year: number = new Date().getFullYear();
 // profilSrc :any;
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
  sidebartype: string ='';

  utilisateurAuthentifie: any;
  utilisateurAuthentifieState$?: Observable<ModelDataState<UtilisateurAuthentifie>>;


  constructor(private router: Router,
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
      console.log(`Demain est férié ! N'oubliez pas de vous reposer et de célébrer ${this.holidayNameTomorrow} ! 🎉`);
    }

    if (this.isNextDayHoliday && tomorrow.isSame(holidays[0], 'day')) {
      console.log(`Le jour suivant est férié ! Profitez de votre journée de repos et de la célébration de ${this.holidayNameNextDay} ! 🎉`);
    }

    if (this.isRegularDay) {
      console.log("Il n'y a pas de jour férié prévu. " + this.motivationMessage);
    }

  }

  ngOnInit() {
    registerLocaleData(localeFr, 'fr');
    this.items = [{ label: 'Espace de travail ' }, { label: 'Logiciels', active: true }];
    this.obtenirUnUtilisateurParEmail();
    this.sidebartype = SIDEBAR_TYPE;
    const h = new Date().getHours();
    this.greeting = h < 12 ? 'Bonjour' : (h < 18 ? 'Bon après-midi' : 'Bonsoir');
    this.heroStats = this.heroStats.map(s =>
  s.label === 'Statut'
    ? { ...s, value: this.isHolidayToday ? 'Jour férié 🎉' : (this.isHolidayTomorrow ? 'Férié demain' : 'Journée ouvrée') }
    : s
);
    // listen to event and change the layout, theme, etc
    /*
    this.eventService.subscribe('changeSidebartype', (layout) => {
      this.sidebartype = layout;
      //this.changeSidebar(this.sidebartype);
    });
    */

    //this.changeSidebar(this.sidebartype);

    document.body.setAttribute('data-layout', 'vertical');
    console.log("utilisateur connecter ici ",this.utilisateurAuthentifie.personnel?.etatCivil?.prenom)

  }

  creationImage(image: Blob) {
    if (image && image.size > 0) {
      let objectURL = URL.createObjectURL(image);
      this.profilSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    } else {
      //alert("Pas de fichier");
      //this.showSpinner = false;
    }
  }


  afficherImageDeProfil(image_de_profil?: string): void {
    if (!image_de_profil) return;

  const obs = this.authenficationSerice.recuperationDeImageDeProfil(image_de_profil);
  if (!obs) return;

  obs.subscribe({
    next: (blob: Blob) => this.creationImage(blob),
    error: () => {
      // gestion erreur
    },
  });
  }

  greeting = '';
today = new Date();

quickLinks = [
  { label: 'Utilisateurs', route: '/utilisateur', icon: 'bx bx-user-circle' },
  { label: 'Ressources Humaines', route: '/rh', icon: 'bx bx-id-card' },
  { label: 'Gestion de la Paie', route: '/paie', icon: 'bx bx-wallet' },
  { label: 'Formation Interne', route: '/personnel', icon: 'bx bx-book-open' },
  // { label: 'Publication', route: '/publication', icon: 'bx bx-news' },
  // { label: 'Tâches', route: '/tache', icon: 'bx bx-task' },
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
  { label: 'Dernière connexion', value: (new Date()).toLocaleDateString('fr-FR'), icon: 'bx bx-time-five' },
  { label: 'Aujourd’hui', value: (new Date()).toLocaleDateString('fr-FR', { weekday: 'long' }), icon: 'bx bx-calendar-event' },
  { label: 'Statut', value: '—', icon: 'bx bx-bell' },
  { label: 'Profil', value: 'Complet', icon: 'bx bx-user-check' },
];

annonces = [
  { title: 'Bienvenue', text: 'Découvrez la nouvelle page d’accueil.', cta: { label: 'En savoir +', route: '/publication' } },
  { title: 'Support', text: 'Un souci ? Le centre d’aide est là.', cta: { label: 'Centre d’aide', route: '/moncompte/parametre' } },
  { title: 'Paie', text: 'Clôture du mois courant dans 5 jours.' },
];


  obtenirUnUtilisateurParEmail() {

    const email = sessionStorage.getItem("email") ?? ""; 
    console.log("utilisateur connecter ",email);
  this.utilisateurAuthentifieState$ = this.authenficationSerice
  .obtenirUnUtilisateurParEmail(email)
  .pipe(
    map(data => {
      this.utilisateurAuthentifie = data;
      this.email = data?.email ?? null;
      this.afficherImageDeProfil(data?.image_de_profil);
      return { data, dataState: DataStateEnum.CHARGE };
    }),
    startWith({ dataState: DataStateEnum.CHARGEMENT }),
    catchError((error: HttpErrorResponse) => this.authenficationSerice.gestionnaireDerreur(error))
  );

    }

  isMobile() {
    const ua = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);
  }

  ngAfterViewInit() {
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

  /*
  changeSidebar(value) {
    switch (value) {
      case "light":
        document.body.setAttribute('data-sidebar', 'light');
        document.body.setAttribute('data-topbar', 'dark');
        document.body.removeAttribute('data-sidebar-size');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.classList.remove('vertical-collpsed');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case "compact":
        document.body.setAttribute('data-sidebar-size', 'small');
        document.body.setAttribute('data-sidebar', 'dark');
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.classList.remove('sidebar-enable');
        document.body.classList.remove('vertical-collpsed');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case "dark":
        document.body.setAttribute('data-sidebar', 'dark');
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.removeAttribute('data-sidebar-size');
        document.body.classList.remove('sidebar-enable');
        document.body.classList.remove('vertical-collpsed');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case "icon":
        document.body.classList.add('vertical-collpsed');
        document.body.setAttribute('data-sidebar', 'dark');
        document.body.removeAttribute('data-layout-size');
        document.body.setAttribute('data-keep-enlarged',"true");
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case "colored":
        document.body.classList.remove('sidebar-enable');
        document.body.classList.remove('vertical-collpsed');
        document.body.setAttribute('data-sidebar', 'colored');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-scrollable');
        document.body.removeAttribute('data-sidebar-size');
        break;
      default:
        document.body.setAttribute('data-sidebar', 'light');
        break;
    }
  }
  */
  /**
   * On mobile toggle button clicked
   */
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
    const year = moment().year(); // Obtenir l'année actuelle
    const holidays: moment.Moment[] = [];

    // Ajouter les dates des jours fériés selon le calendrier béninois
    // Exemple avec les jours fériés du Bénin (peuvent varier selon les années)
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
    // Retourner le nom du jour férié en fonction de la date
    // Vous pouvez mettre en place une logique spécifique ici si nécessaire
    // Pour cet exemple, nous utilisons une correspondance simple avec une liste de noms prédéfinis
    const holidayNames :Record<string, string>={
      '01-01' : "Nouvel An",
      '01-10' : "Fête du Vodoun",
      '04-10' : "Lundi de Pâques",
      '04-21' : "Aïd El Fitr",
      '05-01' : "Fête du Travail",
      '05-18' : "Fête de l'Ascension",
      '05-29' : "Lundi de Pentecôte",
      '06-18' : "Fête des pères",
      '06-29' : "Fête de la Tabaski",
      '08-01' : "Fête de l'Indépendance",
      '08-15' : "Fête de l'Assomption et de l'Igname",
      '09-27' : "Fête de la Maouloud",
      '11-01' : "Fête de la Toussaint",
      '12-25' : "Fête de Noël"
    };

    const formattedDate = date.format('MM-DD');
    return holidayNames[formattedDate] || '';
  }

  getRandomMotivationMessage(): string {
    const motivationMessages = [
      "Restez motivé et continuez votre excellent travail ! 💪",
      "Chaque petit pas compte. Continuez à avancer vers vos objectifs ! 🚀",
      "Le succès est le résultat d'un travail acharné et de la persévérance. Ne lâchez rien ! 💯",
      "Votre détermination est votre plus grand atout. Ne cessez jamais d'y croire ! 🔥",
      "Chaque jour est une nouvelle opportunité pour briller. Faites de votre mieux aujourd'hui ! ✨",
      "Les défis font partie du chemin vers le succès. Ne les craignez pas, mais surmontez-les ! 💪",
      "Votre travail a un impact. Continuez à faire la différence dans tout ce que vous entreprenez ! 👏",
      "Le succès ne vient pas du confort. Sortez de votre zone de confort et réalisez de grandes choses ! 💫",
      "La persévérance est la clé du succès. Continuez à avancer même lorsque les choses deviennent difficiles ! 🌟",
      "Chaque jour est une occasion de grandir et d'apprendre. Saisissez-la et faites-en une journée productive ! 🌞",
      "La réussite demande du temps et de la patience. Restez concentré et avancez étape par étape ! 🕰️",
      "Les échecs font partie de l'apprentissage. Ne craignez pas de faire des erreurs, mais apprenez-en et progressez ! 📚",
      "La confiance en soi est la clé du succès. Croyez en vos compétences et en votre potentiel ! 💪",
      "Le travail d'équipe est essentiel pour atteindre de grands objectifs. Collaborez, écoutez et soutenez-vous mutuellement ! 🤝",
      "La motivation est éphémère, la discipline est durable. Cultivez la discipline pour rester sur la voie du succès ! 🚀",
      "Chaque jour est une nouvelle occasion de vous améliorer. Ne regardez pas en arrière, mais avancez vers le futur ! 👀",
      "Le succès n'est pas un accident, c'est le résultat d'un travail acharné, de la persévérance et de la détermination ! 💪",
      "Fixez-vous des objectifs ambitieux et travaillez dur pour les atteindre. Vous êtes capable de grandes choses ! 🌟",
      "N'ayez pas peur de sortir de votre zone de confort. C'est là que se trouvent les opportunités de croissance et de succès ! 🌈",
      "Faites preuve de gratitude pour ce que vous avez et continuez à viser plus haut. La gratitude ouvre la porte à l'abondance ! 🙏",
      "La motivation vous met en marche, l'habitude vous fait avancer. Cultivez de bonnes habitudes pour rester sur la voie du succès ! 🚶‍♂️",
      "Chaque jour est une nouvelle page blanche. Écrivez une histoire épique avec vos actions et vos accomplissements ! 📖",
      "Le succès est un marathon, pas un sprint. Soyez patient, persévérez et vous franchirez la ligne d'arrivée ! 🏁",
      "Vos actions parlent plus fort que vos paroles. Faites en sorte que vos actions inspirent les autres et fassent la différence ! 💫",
      "Le succès est la somme de petits efforts répétés jour après jour. Soyez constant et vous obtiendrez des résultats extraordinaires ! 💪",
      "Votre état d'esprit détermine votre succès. Cultivez un état d'esprit positif, optimiste et orienté vers les solutions ! 💡",
      "Le succès ne se mesure pas seulement par l'argent ou le statut, mais par le bonheur et la satisfaction que vous ressentez dans votre vie ! 😊",
      "Ne laissez pas la peur de l'échec vous empêcher d'essayer. Les plus grandes réussites sont souvent le fruit de nombreuses tentatives ! 🌟",
      "Chaque obstacle que vous rencontrez est une opportunité déguisée. Faites preuve de résilience et transformez les défis en succès ! 🏆",
      "La différence entre le possible et l'impossible réside dans votre détermination. Croyez en vous et faites l'impossible ! 🔓",
      "Les petites victoires sont aussi importantes que les grandes. Célébrez chaque étape de votre parcours vers le succès ! 🎉",
      "La vie est trop courte pour perdre du temps à douter de vous-même. Faites confiance à vos compétences et avancez avec confiance ! 💪",
      "N'abandonnez jamais vos rêves simplement parce qu'ils prennent du temps à se réaliser. Continuez à travailler et à croire en vous ! 🌠",
      "La persévérance est la clé du succès. Même lorsque vous rencontrez des obstacles, continuez à avancer avec détermination ! 💫",
      "Les erreurs sont des occasions d'apprendre et de grandir. Ne craignez pas l'échec, mais utilisez-le comme un tremplin vers le succès ! 📚",
      "Chaque jour est une nouvelle opportunité pour vous rapprocher de vos objectifs. Profitez de chaque instant et faites-en une journée productive ! ⏳",
      "La réussite n'est pas définie par les circonstances extérieures, mais par votre attitude intérieure. Cultivez une mentalité positive et prospère ! 🌈",
      "La clé du succès réside dans la persévérance. Même lorsque les choses deviennent difficiles, restez motivé et continuez à avancer ! 💪",
      "Le chemin vers le succès est rarement linéaire. Soyez prêt à faire face à des hauts et des bas, mais ne perdez jamais de vue votre objectif final ! 🚀",
      "Le succès est un voyage, pas une destination. Appréciez chaque étape de votre parcours et célébrez vos progrès ! 🎉",
      "Votre plus grand adversaire est vous-même. Surmontez vos doutes et vos peurs, et vous découvrirez votre véritable potentiel ! 💫",
      "La motivation est éphémère, mais la discipline est durable. Cultivez la discipline et faites de chaque jour une journée productive ! 📅",
      "Chaque petit pas compte. Ne sous-estimez pas l'impact de vos actions quotidiennes sur votre chemin vers le succès ! 🚶‍♀️",
      "Le succès est le résultat d'efforts constants et cohérents. Soyez patient, persévérez et vous récolterez les fruits de votre travail acharné ! 🌟",
      "La clé pour atteindre vos objectifs est de vous concentrer sur les progrès, pas sur la perfection. Chaque petit pas vous rapproche un peu plus de votre réussite ! 🎯",
      "La confiance en soi est la clé du succès. Croyez en vos capacités et en votre valeur, et vous attirerez le succès à vous ! 💪",
      "Le succès ne se mesure pas seulement en termes d'argent ou de renommée, mais en termes de bonheur et de satisfaction personnelle. Trouvez ce qui vous rend vraiment heureux et poursuivez-le ! 😊",
      "Les défis sont des opportunités déguisées. Ne les craignez pas, mais embrassez-les avec détermination et utilisez-les pour grandir et vous améliorer ! 💪",
      "La vie est trop courte pour la passer à douter de vous-même. Croyez en vos capacités, soyez audacieux et osez réaliser vos rêves les plus fous ! 🌠",
      "Chaque jour est une nouvelle chance de vous rapprocher de vos rêves. Saisissez cette opportunité, travaillez dur et faites de chaque jour un pas de plus vers votre succès ! 🚀",
      "Les échecs ne sont pas des fins en soi, mais des leçons précieuses sur la voie du succès. Apprenez de vos erreurs, ajustez votre parcours et continuez à avancer avec détermination ! 📚",
      "Le succès n'est pas réservé à quelques privilégiés, mais à ceux qui sont prêts à travailler dur et à persévérer. Vous avez le pouvoir de créer votre propre réussite ! 💪",
      "La clé pour atteindre vos objectifs est de rester concentré et déterminé, même lorsque les choses deviennent difficiles. Ne laissez pas les obstacles vous décourager, mais utilisez-les comme des tremplins vers votre succès ! 🚀",
      "Le succès ne vient pas du jour au lendemain, mais du cumul de petites actions et de décisions prises chaque jour. Faites preuve de constance et de détermination, et vous verrez les résultats se manifester progressivement ! 🌟",
      "Votre plus grand adversaire n'est pas les autres, mais votre propre état d'esprit. Cultivez une mentalité positive, croyez en vous-même et en votre potentiel illimité ! 💫",
      "La clé pour atteindre vos objectifs est de sortir de votre zone de confort. Prenez des risques calculés, essayez de nouvelles choses et découvrez tout ce dont vous êtes capable ! 🌈",
      "Le succès ne se mesure pas seulement en termes de résultats, mais aussi en termes d'efforts et de persévérance. Célébrez chaque étape de votre parcours vers le succès et soyez fier de vous ! 🎉",
      "La motivation peut vous mettre en marche, mais la discipline vous fait avancer. Cultivez la discipline pour rester sur la voie du succès, même lorsque la motivation diminue ! 💪",
      "Chaque jour est une nouvelle opportunité de vous améliorer et de grandir. Profitez de chaque instant, apprenez de vos expériences et devenez la meilleure version de vous-même ! 🌟",
      "La clé pour atteindre vos objectifs est de vous entourer de personnes qui vous inspirent et vous soutiennent. Entourez-vous de personnes positives, motivées et ambitieuses, et ensemble, vous accomplirez de grandes choses ! 🤝",
      "La vie est trop courte pour la passer à faire un travail qui ne vous passionne pas. Trouvez votre passion, poursuivez-la avec détermination et vous ferez du travail un véritable plaisir ! 🔥",
      "La confiance en soi est la clé pour réaliser vos rêves les plus fous. Croyez en vos compétences, en votre valeur et en votre potentiel illimité ! 💫",
      "Le succès ne dépend pas uniquement de vos compétences, mais aussi de votre attitude et de votre état d'esprit. Cultivez une mentalité positive, confiante et orientée vers les solutions, et vous attirerez le succès à vous ! 🌟",
      "Les grands accomplissements sont souvent le résultat de petites actions accomplies quotidiennement. Faites preuve de constance, de persévérance et de détermination, et vous réaliserez de grandes choses ! 💪",
      "La clé pour atteindre vos objectifs est de rester concentré sur votre vision et de ne jamais perdre de vue votre objectif final. Gardez à l'esprit que chaque petit pas que vous faites vous rapproche un peu plus de votre réussite ! 🚀",
      "La motivation peut vous donner le départ, mais la détermination vous fait franchir la ligne d'arrivée. Cultivez votre détermination, surmontez les obstacles et accomplissez des choses extraordinaires ! 💪",
      "Le succès est un voyage, pas une destination. Appréciez chaque étape de votre parcours, tirez des leçons de chaque expérience et grandissez en tant qu'individu tout au long du chemin ! 🌱",
      "La réussite demande du temps et des efforts. Soyez patient, persévérez et restez focalisé sur vos objectifs, car chaque pas en avant vous rapproche un peu plus de votre réussite ! 🌟",
      "Le succès n'est pas réservé à quelques privilégiés, mais à ceux qui sont prêts à travailler dur et à faire les sacrifices nécessaires. Soyez prêt à mettre l'effort nécessaire et vous verrez les résultats se manifester ! 💫",
      "La clé pour atteindre vos objectifs est de rester résilient face aux échecs et aux difficultés. Apprenez de chaque échec, relevez-vous plus fort et continuez à avancer avec détermination ! 🌠",
      "Le succès ne se mesure pas seulement par les accomplissements extérieurs, mais aussi par la croissance personnelle que vous réalisez sur votre chemin. Évoluez, apprenez et devenez la meilleure version de vous-même ! 🌻",
      "La motivation peut vaciller, mais votre passion et votre détermination doivent rester inébranlables. Cultivez votre passion, nourrissez-la et elle vous conduira vers des sommets insoupçonnés ! 🔥",
      "La clé pour atteindre vos objectifs est de faire preuve de persévérance, même lorsque les résultats tardent à se manifester. Continuez à croire en vous-même et en votre potentiel, et vous réussirez ! 🌟",
      "Le succès est le résultat d'un travail acharné, d'une vision claire et de la volonté de persévérer lorsque les temps sont difficiles. Gardez votre vision vivante, restez motivé et les portes s'ouvriront devant vous ! 💪",
      "La vie est trop courte pour vivre dans la peur et le doute. Faites preuve de courage, sortez de votre zone de confort et découvrez tout ce dont vous êtes capable ! 🌈",
      "La clé pour atteindre vos objectifs est de vous entourer de personnes positives et inspirantes. Trouvez votre cercle de soutien, partagez vos rêves et vos aspirations, et ensemble, vous repousserez les limites du possible ! 🤝",
      "Le succès n'est pas seulement mesuré par la destination, mais aussi par le voyage. Appréciez chaque instant, chaque étape et chaque leçon apprise en cours de route, car c'est là que réside la vraie richesse ! 🌟",
      "La confiance en soi est le fondement de tout succès. Croyez en vous-même, en vos capacités et en votre valeur, et vous déplacerez des montagnes ! 💫",
      "La clé pour atteindre vos objectifs est de rester focalisé sur l'essentiel. Éliminez les distractions, concentrez-vous sur ce qui compte vraiment et avancez avec détermination vers votre réussite ! 🚀",
      "Le succès ne se mesure pas seulement en termes d'accomplissements professionnels, mais aussi en termes d'épanouissement personnel. Recherchez l'équilibre, nourrissez votre âme et vous vivrez une vie véritablement réussie ! 🌺",
      "Votre détermination et votre persévérance sont plus puissantes que n'importe quel obstacle sur votre chemin. Faites preuve de résilience, restez fort et rien ne pourra vous arrêter ! 💪",
      "La clé pour atteindre vos objectifs est de vous fixer des objectifs clairs et réalisables. Divisez votre chemin vers le succès en étapes réalisables, et chaque petite victoire vous rapprochera de votre réussite finale ! 🌟",
      "Le succès ne dépend pas seulement de votre talent inné, mais aussi de votre capacité à travailler dur et à persévérer. L'effort et la détermination peuvent compenser tout manque initial de compétences ! 💫",
      "La clé pour atteindre vos objectifs est de prendre des mesures dès maintenant. N'attendez pas le moment parfait, car il n'arrivera jamais. Agissez, ajustez en cours de route et progressez vers votre succès ! 🚀",
      "Le succès n'est pas un événement ponctuel, mais une mentalité à adopter au quotidien. Cultivez une mentalité de succès, faites preuve de gratitude et vous attirerez plus de réussite dans votre vie ! 🌟",
      "Votre attitude est l'un des outils les plus puissants pour atteindre le succès. Choisissez une attitude positive, résiliente et orientée vers les solutions, et vous surmonterez tous les défis qui se présentent à vous ! 💪",
      "La clé pour atteindre vos objectifs est de rester focalisé sur votre propre parcours, sans vous comparer aux autres. Chaque personne a un rythme différent, alors avancez à votre propre rythme et vous arriverez là où vous devez être ! 🌟",
      "Le succès est un voyage personnel. Ce qui compte, c'est le progrès que vous réalisez chaque jour et la personne que vous devenez tout au long de votre parcours. Profitez de l'aventure et appréciez le processus ! 🌈",
      "La persévérance est la clé pour surmonter les échecs et atteindre le succès. Continuez à avancer, même lorsque tout semble impossible, et vous découvrirez une force et une résilience dont vous ne pensiez pas être capable ! 💪",
      "La clé pour atteindre vos objectifs est de vous entourer de personnes qui vous encouragent, vous soutiennent et croient en vous. Votre environnement peut avoir un impact énorme sur votre réussite, alors choisissez judicieusement vos compagnons de route ! 🤝",
      "Le succès est le résultat d'une combinaison de talent, de travail acharné et de persévérance. Ne sous-estimez pas votre propre potentiel, car vous êtes capable de grandes choses ! 🌟",
      "La clé pour atteindre vos objectifs est de rester flexible et adaptable. Le chemin vers le succès peut être sinueux, alors soyez prêt à vous ajuster, à apprendre de nouvelles compétences et à saisir les opportunités qui se présentent à vous ! 🌠",
      "Le succès ne se mesure pas seulement par la richesse matérielle, mais aussi par l'impact que vous avez sur les autres et sur le monde qui vous entoure. Poursuivez vos objectifs avec compassion et générosité, et votre réussite sera plus gratifiante que jamais ! 🌟",
      "La confiance en soi est la fondation sur laquelle repose tout succès. Croyez en votre valeur, en vos capacités et en votre potentiel infini, et vous ouvrirez les portes vers un avenir incroyablement brillant ! 💫",
      "Le succès ne vient pas à ceux qui attendent, mais à ceux qui agissent. Ne laissez pas la procrastination et l'indécision vous freiner. Prenez des mesures dès maintenant et vous vous rapprocherez de vos rêves chaque jour ! 🚀",
      "La clé pour atteindre vos objectifs est de trouver un équilibre entre le travail acharné et le temps pour vous-même. Prenez soin de votre bien-être, rechargez vos batteries et vous serez plus productif et efficace dans votre quête de réussite ! 🌟",
      "Votre parcours vers le succès peut être difficile, mais chaque défi que vous rencontrez vous rend plus fort et plus résilient. Continuez à surmonter les obstacles, car votre persévérance est la clé de votre victoire finale ! 💪",
      "La clé pour atteindre vos objectifs est de vous engager à devenir la meilleure version de vous-même. Cultivez la croissance personnelle, apprenez continuellement et vous vous ouvrirez les portes vers un succès sans limites ! 🌟",
      "Le succès est le reflet de votre détermination, de votre travail acharné et de votre volonté de persévérer malgré les défis. Ne laissez jamais les difficultés vous décourager, car chaque épreuve vous rend plus fort et vous rapproche de votre réussite ! 🌟",
      "La clé pour atteindre vos objectifs est de vous entourer d'une équipe solide. Cherchez des mentors, des collaborateurs et des amis qui partagent votre vision et vous soutiennent dans votre quête de succès. Ensemble, vous pouvez accomplir de grandes choses ! 🤝",
      "Le succès n'est pas un sprint, c'est un marathon. Pacez-vous, prenez le temps de récupérer et de recharger vos énergies. Vous êtes en route vers une réussite durable et épanouissante ! 🌟",
      "La confiance en soi est votre super pouvoir secret. Croyez en vous-même, en vos talents et en votre capacité à surmonter tous les obstacles sur votre chemin. Vous êtes destiné à accomplir de grandes choses ! 💫",
      "La clé pour atteindre vos objectifs est de prendre des risques calculés. Sortez de votre zone de confort, essayez de nouvelles approches et embrassez les opportunités qui se présentent à vous. Le succès récompense ceux qui osent ! 🌟",
      "Le succès est le résultat d'une combinaison de talent, de travail acharné et de détermination. Soyez prêt à mettre l'effort nécessaire, à vous améliorer constamment et à ne jamais abandonner. Vous êtes capable de grandes réalisations ! 🌟",
      "La clé pour atteindre vos objectifs est de rester concentré sur votre propre parcours. Ne vous laissez pas distraire par les comparaisons avec les autres. Votre voyage est unique et magnifique à sa manière. Embrassez-le et vivez votre propre version de la réussite ! 🌈",
      "Le succès ne se mesure pas seulement à l'argent que vous gagnez, mais aussi à l'impact positif que vous avez sur le monde. Poursuivez des objectifs qui vous passionnent et qui apportent une contribution significative à la société. C'est ainsi que vous créerez un héritage durable ! 🌟",
      "La confiance en soi est le fondement sur lequel repose toute réussite. Croyez en votre potentiel, en votre valeur et en votre capacité à réaliser vos rêves. Lorsque vous croyez en vous-même, tout devient possible ! 💪",
    ];

    const randomIndex = Math.floor(Math.random() * motivationMessages.length);
    return motivationMessages[randomIndex];
  }

}

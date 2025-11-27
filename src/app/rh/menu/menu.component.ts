import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input,
  OnChanges
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '../../commun/services/event.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthentificationService } from '../../authentification/services/authentication.service';
import { MENU } from './menu';
import { MenuItem } from './menu.model';
import MetisMenu from 'metismenujs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('componentRef') scrollRef!: any;
  @ViewChild('sideMenu') sideMenu!: ElementRef;

  @Input() isCondensed = false;

  menu: any;              // instance MetisMenu
  data: any;
  menuItems: MenuItem[] = [];

  constructor(
    private eventService: EventService,
    private router: Router,
    public translate: TranslateService,
    private http: HttpClient,
    private auth: AuthentificationService,
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
        this._scrollElement();
      }
    });
  }

  ngOnInit(): void {
    this.initialize();      // construit le menu une première fois
    this._scrollElement();
  }

  ngAfterViewInit(): void {
    // Une seule initialisation de MetisMenu ici
    this.initMetisMenu();
  }

  ngOnChanges(): void {
    // Quand le mode condensed change, on re-init proprement MetisMenu
    if (this.sideMenu?.nativeElement) {
      setTimeout(() => this.initMetisMenu(), 0);
    } else if (this.menu) {
      this.menu.dispose();
      this.menu = null;
    }
  }

  // ================== INITIALISATION DU MENU (admin / personnel) ==================

  private initialize(): void {
    // 1) Valeur rapide depuis la session
    let isAdmin = this.auth.isAdmin();

    const apply = (admin: boolean) => {
      // admin → MENU complet, personnel → menu simplifié
      this.menuItems = admin ? MENU : this.buildPersonnelMenu(MENU);
      setTimeout(() => {
        this.initMetisMenu();
      }, 0);
    };

    apply(isAdmin);

    // 3) Vérification côté backend pour confirmer le rôle
    const email = (sessionStorage.getItem('email') || '').trim();
    if (email) {
      this.auth.obtenirUnUtilisateurParEmail(email).subscribe({
        next: (user: any) => {
          const fromFlag   = !!(user?.est_admin ?? user?.estAdmin);
          const rolesArray = (user?.roles ?? user?.roleList ?? [])
            .map((r: any) => (r?.nom || r).toString().toUpperCase());
          const fromRoles  = rolesArray.some((r: string) => r.includes('ADMIN'));
          const finalIsAdmin = isAdmin || fromFlag || fromRoles;

          if (finalIsAdmin !== isAdmin) {
            isAdmin = finalIsAdmin;
            apply(isAdmin);
            sessionStorage.setItem('isAdmin', String(isAdmin));
          }
        },
        error: () => {
          // en cas d'erreur API, on garde le menu actuel
        }
      });
    }
  }

  /** Build du menu côté personnel à partir du MENU admin */
  private buildPersonnelMenu(source: MenuItem[]): MenuItem[] {
    const byLink = new Map<string, MenuItem>();

    const collect = (items: MenuItem[]) => {
      for (const it of items) {
        if (it.link) byLink.set(String(it.link).trim(), it);
        if (it.subItems?.length) collect(it.subItems);
      }
    };
    collect(source);

    const titreFonct1 = source.find(
      i => i.isTitle && (i.label ?? '').toLowerCase() === 'les fonctionalites'
    );
    const titreFonct2 = source.find(
      i => i.isTitle && (i.label ?? '').toLowerCase() === 'les fonctionnalités'
    );
    const portail =
      source.find(i => (i.label ?? '').trim() === 'Portail') ||
      byLink.get('/espacedetravail') ||
      byLink.get('espacedetravail');

    const out: MenuItem[] = [];

    if (titreFonct1) out.push({ ...titreFonct1, subItems: undefined });
    if (portail) out.push({ ...portail, subItems: undefined });
    if (titreFonct2) out.push({ ...titreFonct2, subItems: undefined });

    // Dashboard perso
    out.push({
      id: 9001,
      label: 'Mon tableau de bord',
      icon: 'bx-bar-chart-square',
      link: 'mon-dashboard'
    });

    const wanted: Array<{ link: string; newLabel: string; newLink?: string }> = [
      { link: 'presences',     newLabel: 'Mes présences',     newLink: 'mes-presences' },
      { link: 'demandes',      newLabel: 'Mes demandes',      newLink: 'mes-demandes' },
      { link: 'conges',        newLabel: 'Mes congés',        newLink: 'mes-conges' },
      { link: 'affectations',  newLabel: 'Mes affectations',  newLink: 'mes-affectations' },
      { link: 'missions',      newLabel: 'Mes missions',      newLink: 'mes-missions' },
      { link: 'frais',         newLabel: 'Mes frais' },
      { link: 'contrats',      newLabel: 'Mes contrats',      newLink: 'mes-contrats' },
    ];

    for (const w of wanted) {
      const src = byLink.get(w.link);
      if (!src) continue;
      out.push({
        ...src,
        label: w.newLabel,
        link: w.newLink ?? src.link,
        subItems: undefined
      });
    }

    return out;
  }

  // ================== METISMENU : UNE SEULE INSTANCE ==================

  private initMetisMenu(): void {
    if (!this.sideMenu?.nativeElement) return;

    // On détruit l’ancienne instance si elle existe
    if (this.menu) {
      this.menu.dispose();
      this.menu = null;
    }

    // On crée une nouvelle instance sur l’élément actuel
    this.menu = new MetisMenu(this.sideMenu.nativeElement);
    this._activateMenuDropdown();
  }

  // ================== GESTION DU SCROLL / ACTIVE ==================

  private _scrollElement(): void {
    setTimeout(() => {
      const activeEls = document.getElementsByClassName('mm-active');
      if (activeEls.length > 0) {
        const currentPosition = (activeEls[0] as HTMLElement).offsetTop;
        if (currentPosition > 500 && this.scrollRef?.SimpleBar) {
          this.scrollRef.SimpleBar.getScrollElement().scrollTop =
            currentPosition + 300;
        }
      }
    }, 300);
  }

  private _removeAllClass(className: string) {
    const els = document.getElementsByClassName(className);
    while (els.length > 0) {
      els[0].classList.remove(className);
    }
  }

  private _activateMenuDropdown(): void {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');

    const links = document.getElementsByClassName(
      'side-nav-link-ref'
    ) as HTMLCollectionOf<HTMLAnchorElement>;

    let menuItemEl: HTMLAnchorElement | null = null;
    const paths: string[] = [];

    for (let i = 0; i < links.length; i++) {
      paths.push(links[i].pathname);
    }

    const itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)] ?? null;
    } else {
      menuItemEl = links[itemIndex];
    }

    if (menuItemEl) {
      menuItemEl.classList.add('active');
      let parentEl: HTMLElement | null = menuItemEl.parentElement;
      while (parentEl && parentEl.id !== 'side-menu') {
        parentEl.classList.add('mm-active');
        const ulEl = parentEl.querySelector('ul');
        if (ulEl) ulEl.classList.add('mm-show');
        parentEl = parentEl.parentElement as HTMLElement;
      }
    }
  }

  // ================== UTILES ==================

  hasItems(item: MenuItem): boolean {
    return !!item.subItems && item.subItems.length > 0;
  }

  toggleMenu(event: any) {
    // si tu veux gérer manuellement certains parents, tu peux l’utiliser
    event.currentTarget.nextElementSibling?.classList.toggle('mm-show');
  }
}

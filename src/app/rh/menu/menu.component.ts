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

  menu: any;
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

  // ✅ REQUIRED by OnInit
  ngOnInit(): void {
    this.initialize();      // initialise le menu
    this._scrollElement();  // conserve ton comportement existant
  }

  ngAfterViewInit(): void {
    if (this.sideMenu?.nativeElement) {
      this.menu = new MetisMenu(this.sideMenu.nativeElement);
      this._activateMenuDropdown();
    }
  }

  // ✅ SINGLE initialize() — version “améliorée” (flag + check backend)
  private initialize(): void {
    // 1) Lecture rapide depuis le stockage
    let isAdmin = this.auth.isAdmin();

    // 2) Réglage initial du menu
    const apply = (admin: boolean) => {
      this.menuItems = admin ? MENU : this.buildPersonnelMenu(MENU);
      setTimeout(() => {
        if (this.sideMenu?.nativeElement) {
          this.menu = new MetisMenu(this.sideMenu.nativeElement);
          this._activateMenuDropdown();
        }
      });
    };

    apply(isAdmin);

    // 3) Vérif backend (plus fiable) pour confirmer le rôle
    const email = (sessionStorage.getItem('email') || '').trim();
    if (email) {
      this.auth.obtenirUnUtilisateurParEmail(email).subscribe({
        next: (user: any) => {
          const fromFlag   = !!(user?.est_admin ?? user?.estAdmin);
          const rolesArray = (user?.roles ?? user?.roleList ?? [])
            .map((r:any)=> (r?.nom || r).toString().toUpperCase());
          const fromRoles  = rolesArray.some((r:string)=> r.includes('ADMIN'));
          const finalIsAdmin = isAdmin || fromFlag || fromRoles;

          if (finalIsAdmin !== isAdmin) {
            isAdmin = finalIsAdmin;
            apply(isAdmin);
            sessionStorage.setItem('isAdmin', String(isAdmin));
          }
        },
        error: _ => {
          // on garde l’affichage courant si l’API tombe
        }
      });
    }
  }

private buildPersonnelMenu(source: MenuItem[]): MenuItem[] {
  // Index par link pour réutiliser icônes/links existants
  const byLink = new Map<string, MenuItem>();
  const collect = (items: MenuItem[]) => {
    for (const it of items) {
      if (it.link) byLink.set(String(it.link).trim(), it);
      if (it.subItems?.length) collect(it.subItems);
    }
  };
  collect(source);

  // Récupérer quelques items utiles
  const titreFonct1 = source.find(i => i.isTitle && (i.label ?? '').toLowerCase() === 'les fonctionalites');
  const titreFonct2 = source.find(i => i.isTitle && (i.label ?? '').toLowerCase() === 'les fonctionnalités');
  const portail = source.find(i => (i.label ?? '').trim() === 'Portail')
              ?? byLink.get('/espacedetravail')
              ?? byLink.get('espacedetravail');

  // Construit le menu pour le PERSONNEL
  const out: MenuItem[] = [];

  if (titreFonct1) out.push({ ...titreFonct1, subItems: undefined });
  if (portail) out.push({ ...portail, subItems: undefined });
  if (titreFonct2) out.push({ ...titreFonct2, subItems: undefined });

  // ➕ AJOUT EXPLICITE du dashboard personnel (NE TOUCHE PAS à tableaudebord)
  out.push({
    id: 9001,
    label: 'Mon tableau de bord',
    icon: 'bx-bar-chart-square',
    link: 'mon-dashboard'
  });

  // Liens personnels (on remappe vers “mes-*” quand tu veux)
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




  toggleMenu(event: any) {
    event.currentTarget.nextElementSibling.classList.toggle('mm-show');
  }

  ngOnChanges(): void {
    if ((!this.isCondensed && this.sideMenu) || this.isCondensed) {
      setTimeout(() => {
        if (this.sideMenu?.nativeElement) {
          this.menu = new MetisMenu(this.sideMenu.nativeElement);
        }
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }

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
        parentEl = parentEl.parentElement;
      }
    }
  }

  hasItems(item: MenuItem): boolean {
    return item.subItems !== undefined && item.subItems.length > 0;
  }
}

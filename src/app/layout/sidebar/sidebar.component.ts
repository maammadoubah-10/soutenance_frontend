import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';

type NavItem = { label: string; icon: string; route: string; exact?: boolean };

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  currentYear = new Date().getFullYear();

  // --- LOGO ---
  logoUrl = 'assets/groupe_isi.png';      // mets ici le chemin exact de ton logo
  logoError = false;                // fallback si le logo ne charge pas
  initials = 'GI';                  // petites initiales en secours

  // Liens (toujours affichés, aucun filtre permission ici)
 items: NavItem[] = [
  { label: 'Tableau de bord', icon: 'bx bx-home-alt', route: '/espacedetravail/dashboard', exact: true },
  { label: 'Utilisateurs',     icon: 'bx bx-user',     route: '/espacedetravail/utilisateur' },
  { label: 'Rôles',            icon: 'bx bx-group',    route: '/espacedetravail/roles' },
  { label: 'Permissions',      icon: 'bx bx-lock-alt', route: '/espacedetravail/permissions' },
  { label: 'Afficher perms',   icon: 'bx bx-show',     route: '/espacedetravail/permissions' },
  { label: 'Créer permission', icon: 'bx bx-plus',     route: '/espacedetravail/permissions/nouveau' },
];


  visibleItems: NavItem[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.groupCollapsed('%c[Sidebar] ngOnInit', 'color:#1f6fff');
    console.log('[Sidebar] URL =', location.pathname);
    this.visibleItems = [...this.items];
    console.log('[Sidebar] items        =', this.items.length);
    console.log('[Sidebar] visibleItems =', this.visibleItems.length);
    console.groupEnd();
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      const host = document.querySelector('app-sidebar');
      const aside = host?.querySelector('.app-sidebar-panel') as HTMLElement | null;
      const links = host?.querySelectorAll('.nav-link') ?? [];
      const rect = aside?.getBoundingClientRect();

      console.groupCollapsed('%c[Sidebar] AfterView', 'color:#12a150');
      console.log('[Sidebar] liens rendus =', links.length);
      links.forEach((n, i) => console.log(`  #${i+1}:`, (n as HTMLElement).innerText.trim()));
      console.log('[Sidebar] rect =', rect);
      if (aside) {
        const cs = getComputedStyle(aside);
        console.log('[Sidebar] computed display =', cs.display);
        console.log('[Sidebar] computed visibility =', cs.visibility);
        console.log('[Sidebar] computed width =', cs.width, 'min-width =', cs.minWidth, 'z-index =', cs.zIndex);
      }
      console.groupEnd();
    });
    this.cdr.detectChanges();
  }
}

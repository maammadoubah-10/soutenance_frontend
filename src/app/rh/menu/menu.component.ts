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
    private http: HttpClient
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
        this._scrollElement();
      }
    });
  }

  ngOnInit() {
    this.initialize();
    this._scrollElement();
  }

  ngAfterViewInit() {
    if (this.sideMenu?.nativeElement) {
      this.menu = new MetisMenu(this.sideMenu.nativeElement);
      this._activateMenuDropdown();
    }
  }

  toggleMenu(event: any) {
    event.currentTarget.nextElementSibling.classList.toggle('mm-show');
  }

  ngOnChanges() {
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

  private _scrollElement() {
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

  /**
   * remove active and mm-active class
   */
  private _removeAllClass(className: string) {
    const els = document.getElementsByClassName(className);
    while (els.length > 0) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Activate the parent dropdown
   */
  private _activateMenuDropdown() {
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

  /**
   * Initialize
   */
  private initialize(): void {
    this.menuItems = MENU;
  }

  /**
   * Returns true or false if given menu item has child or not
   */
  hasItems(item: MenuItem): boolean {
    return item.subItems !== undefined && item.subItems.length > 0;
  }
}

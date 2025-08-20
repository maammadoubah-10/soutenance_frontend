import { Component } from '@angular/core';
import { Router } from '@angular/router';

type Lang = { code: string; label: string; flag: string };

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  userName = 'Admin';
  logoFallback = false;

  // Langues disponibles
 

  // Langue sélectionnée par défaut (FR)


  constructor(private router: Router) {}

 

  

 

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}

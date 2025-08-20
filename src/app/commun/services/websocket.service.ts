import { Injectable } from '@angular/core';
// @ts-ignore
import {WebSocketSubject} from "rxjs/internal-compatibility";
import {webSocket} from "rxjs/webSocket";
import {GLOBAL_CONFIG} from "../models/global";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    const token = sessionStorage.getItem('token');
    // Ne pas initialiser la connexion WebSocket dans le constructeur
  }

  public connect(): WebSocketSubject<any> {
    // Initialiser la connexion WebSocket ici
    const token = sessionStorage.getItem('token');
    this.socket$ = webSocket(`${GLOBAL_CONFIG.API_BASE_URL_WEBSOCKET}/websocket`);
    // this.socket$ = webSocket('ws://localhost:9002/rh/websocket');
    // this.socket$.next({ type: 'auth', token: token });
    return this.socket$;
  }

  public disconnect(): void {
    if (this.socket$) {
      this.socket$.complete(); // Ferme la connexion websocket
      console.log('Websocket déconnecté.'); // Ajout d'un log pour vérifier la déconnexion
    }
  }
}

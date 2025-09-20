import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { webSocket } from 'rxjs/webSocket';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private socket$?: WebSocketSubject<any>;

  constructor() {}

  public connect(): WebSocketSubject<any> {
    if (this.socket$ && !this.socket$.closed) return this.socket$;

    // Utiliser le même schéma et le même host que l’appli (évite l’erreur TLS)
    const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host   = window.location.host;        // ex: jilms.eismv.org
    const path   = '/personnel/websocket';      // chemin PROXY côté NGINX

    this.socket = webSocket({
      url: `${scheme}://${host}${path}`,
      // Si tu as besoin d'envoyer des headers, pas possible ici -> envoie le token après l'ouverture (comme tu le fais déjà)
    });

    return this.socket;
  }

  private get socket(): WebSocketSubject<any> {
    if (!this.socket$) throw new Error('WebSocket non initialisé');
    return this.socket$;
  }

  private set socket(s: WebSocketSubject<any>) {
    this.socket$ = s;
  }

  public disconnect(): void {
    try {
      this.socket$?.complete();
    } finally {
      this.socket$ = undefined;
      // console.log('Websocket déconnecté.');
    }
  }
}

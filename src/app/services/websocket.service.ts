// src/app/services/websocket.service.ts (exemple simple)
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment as env } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private socket$?: WebSocketSubject<any>;

  connect(): WebSocketSubject<any> {
    if (!this.socket$ || this.socket$.closed) {
      const url = (env.hostmicroservicepersonnel.replace(/^http/, 'ws').replace(/\/?$/, ''))
        + '/ws/notifications'; // contexte '/rh' déjà dans hostmicroservicepersonnel si tu l’as mis
      this.socket$ = webSocket(url);
    }
    return this.socket$;
  }

  disconnect() {
    this.socket$?.complete();
  }
}

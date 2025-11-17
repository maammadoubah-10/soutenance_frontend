// src/app/commun/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket$?: WebSocketSubject<any>;
  private messages$ = new Subject<any>();

  private readonly WS_URL = 'ws://localhost:9002/rh/ws';

  constructor() {}

  /** Connexion + BIND */
  connect(userId: number | string): void {
    if (this.socket$ && !this.socket$.closed) {
      return; // déjà connecté
    }

    console.log('[WS] URL utilisée :', this.WS_URL);

    this.socket$ = webSocket({
      url: this.WS_URL,
      deserializer: e => JSON.parse(e.data),
      openObserver: {
        next: () => {
          console.log('[WS] CONNECTED, envoi du BIND pour userId=', userId);
          this.send({
            type: 'bind',
            userId: String(userId)
          });
        }
      },
      closeObserver: {
        next: (evt) => {
          console.log('[WS] CLOSED', evt);
        }
      }
    });

    this.socket$.subscribe({
      next: (msg) => {
        console.log('[WS] message reçu :', msg);
        this.messages$.next(msg);
      },
      error: (err) => {
        console.error('[WS] error :', err);
      },
      complete: () => {
        console.log('[WS] complete');
      }
    });
  }

  /** Envoi générique */
  send(payload: any): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next(payload);
    } else {
      console.warn('[WS] tentative d’envoi alors que la socket est fermée', payload);
    }
  }

  /** Observable des messages */
  onMessage(): Observable<any> {
    return this.messages$.asObservable();
  }

  disconnect(): void {
    this.socket$?.complete();
    this.socket$ = undefined;
  }
}

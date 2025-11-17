import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CurrentUser {
  id: number;
  email: string;
  personnelId: number;
  nomComplet?: string;
}

@Injectable({ providedIn: 'root' })
export class CurrentUserStore {
  private _user$ = new BehaviorSubject<CurrentUser | null>(null);
  user$: Observable<CurrentUser | null> = this._user$.asObservable();

  set(user: CurrentUser | null) { this._user$.next(user); }
  get value(): CurrentUser | null { return this._user$.value; }
}

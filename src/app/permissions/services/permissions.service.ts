import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Permission, PermissionDto } from '../models/permission.model';

// PAS de slash final ici (on l’ajoute quand il faut)
const BASE = `${environment.hostmicroserviceutilisateur.replace(/\/+$/, '')}/permissions`;

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private http = inject(HttpClient);

  list(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${BASE}`);
  }

  // IMPORTANT: toujours envoyer 'code', même vide, car le back le veut
  page(page = 0, size = 10, code: string = '') {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('code', code); // toujours présent
    return this.http.get<any>(`${BASE}/page`, { params });
  }

  search(code: string) {
    const params = new HttpParams().set('code', code);
    return this.http.get<Permission[]>(`${BASE}/recherche`, { params });
  }

  get(id: number) {
    return this.http.get<Permission>(`${BASE}/${id}`);
  }

  create(dto: PermissionDto) {
    return this.http.post<Permission>(`${BASE}`, dto);
  }

  update(id: number, dto: PermissionDto) {
    return this.http.patch<Permission>(`${BASE}/${id}`, dto);
  }

  remove(id: number) {
    return this.http.delete(`${BASE}/${id}`);
  }
}

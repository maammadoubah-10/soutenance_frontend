import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, RoleDto } from '../models/role.model';
import { Permission } from '../../permissions/models/permission.model';
import { apiUrl } from '../../core/utils/api-url';

const BASE = apiUrl('roles'); // -> /utilisateur/roles

@Injectable({ providedIn: 'root' })
export class RolesService {
  private http = inject(HttpClient);

  list(): Observable<Role[]> {
    return this.http.get<Role[]>(`${BASE}`);
  }

  page(page = 0, size = 10, nom = '') {
    // Toujours envoyer 'nom' (même vide) pour éviter un 400 côté backend rôle
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('nom', nom);
    return this.http.get<any>(`${BASE}/page`, { params });
  }

  search(nom: string) {
    const params = new HttpParams().set('nom', nom ?? '');
    return this.http.get<Role[]>(`${BASE}/recherche`, { params });
  }

  create(dto: RoleDto) {
    return this.http.post<Role>(`${BASE}`, dto);
  }

  update(roleId: number, dto: RoleDto) {
    return this.http.patch<RoleDto>(`${BASE}/${roleId}`, dto);
  }

  remove(id: number) {
    return this.http.delete(`${BASE}/${id}`);
  }

  permissionsOfRole(roleId: number) {
    return this.http.get<Permission[]>(`${BASE}/${roleId}/permissions`);
  }

  addPermissions(roleId: number, permissionIds: number[]) {
    return this.http.patch<Role>(`${BASE}/${roleId}/ajouter-permissions`, permissionIds);
  }

  removePermissions(roleId: number, permissionIds: number[]) {
    return this.http.patch<Role>(`${BASE}/${roleId}/retirer-permissions`, permissionIds);
  }
}

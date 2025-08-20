import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionsService } from '../../services/permissions.service';
import { Permission } from '../../models/permission.model';

@Component({
  selector: 'app-permissions-list',
  templateUrl: './permissions-list.component.html'
})
export class PermissionsListComponent implements OnInit {
  items: Permission[] = [];
  loading = false;
  errorMsg = '';
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  searchCode = '';

  // bouton "Nouvelle permission" -> on l’affiche seulement si on a la permission côté front
  canCreate = JSON.parse(sessionStorage.getItem('permissions') || '[]')
    .some((p: string) => p === 'enregistrer-une-permission' || p === 'gerer-les-permissions');

  constructor(private api: PermissionsService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(page = this.pageIndex) {
    this.loading = true;
    this.errorMsg = '';
    this.api.page(page, this.pageSize, this.searchCode || '')
      .subscribe({
        next: (res) => {
          this.items = res?.content ?? res?.data ?? [];
          this.total = res?.totalElements ?? this.items.length;
          this.pageIndex = page;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMsg = 'Impossible de charger la liste.';
        }
      });
  }

  onSearch() { this.load(0); }
  goNew() { this.router.navigate(['/espacedetravail/permissions/nouveau']); }
}

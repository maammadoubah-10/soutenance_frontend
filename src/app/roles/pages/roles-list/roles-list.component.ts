// src/app/features/roles/pages/roles-list/roles-list.component.ts
import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html'
})
export class RolesListComponent implements OnInit {
  items: Role[] = [];
  loading = false;
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  search = '';

  constructor(private api: RolesService) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading = true;
    this.api.page(this.pageIndex, this.pageSize, this.search ?? '').subscribe({
      next: (res) => {
        this.items = res.content ?? res.items ?? res;
        this.total = res.totalElements ?? this.items.length;
        this.loading = false;
      },
      error: (err) => { console.error('[roles/page] error', err); this.loading = false; }
    });
  }

  onSearch() {
    this.pageIndex = 0;
    this.load();
  }

  remove(id: number) {
    if (!confirm('Supprimer ce rôle ?')) return;
    this.api.remove(id).subscribe({ next: () => this.load() });
  }
}

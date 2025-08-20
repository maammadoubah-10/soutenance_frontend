import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../services/roles.service';
import { PermissionsService } from '../../../permissions/services/permissions.service';
import { Permission } from '../../../permissions/models/permission.model';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-role-permissions',
  templateUrl: './role-permissions.component.html'
})
export class RolePermissionsComponent implements OnInit {
  roleId!: number;
  role: Role | null = null;

  allPerms: Permission[] = [];
  assigned: Permission[] = [];

  qLeft = '';
  qRight = '';
  saving = false;

  constructor(
    private roles: RolesService,
    private perms: PermissionsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roleId = +(this.route.snapshot.paramMap.get('id')!);
    this.perms.list().subscribe(all => this.allPerms = all);
    this.roles.permissionsOfRole(this.roleId).subscribe(curr => this.assigned = curr);
    this.roles.list().subscribe(rs => this.role = rs.find(r => r.id === this.roleId) || null);
  }

  get left(): Permission[] {
    const ids = new Set(this.assigned.map(p => p.id));
    return this.allPerms
      .filter(p => !ids.has(p.id))
      .filter(p => p.code.toLowerCase().includes(this.qLeft.toLowerCase()));
  }
  get right(): Permission[] {
    return this.assigned.filter(p => p.code.toLowerCase().includes(this.qRight.toLowerCase()));
  }

  moveToRight(p: Permission) { if (!this.assigned.find(x => x.id === p.id)) this.assigned = [...this.assigned, p]; }
  moveToLeft(p: Permission)  { this.assigned = this.assigned.filter(x => x.id !== p.id); }

  save() {
    this.saving = true;
    const targetIds = this.right.map(p => p.id);
    this.roles.removePermissions(this.roleId, this.allPerms.map(p => p.id)).subscribe({
      next: () => this.roles.addPermissions(this.roleId, targetIds).subscribe({
        next: () => { this.saving = false; this.router.navigate(['/espacedetravail/roles']); },
        error: () => { this.saving = false; }
      }),
      error: () => { this.saving = false; }
    });
  }
}

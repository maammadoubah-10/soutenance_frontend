// src/app/features/roles/models/role.model.ts
import { Permission } from '../../permissions/models/permission.model';

export interface Role {
  id: number;
  nom: string;
  permissions: Permission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleDto {
  nom: string;
  permissions: number[];
}

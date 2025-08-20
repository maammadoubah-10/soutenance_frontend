// src/app/features/permissions/models/permission.model.ts
export interface Permission {
  id: number;
  code: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionDto {
  code: string;
  description: string;
}

/**
 * @akalin/user_auth_module - Tip Tanımları (types.ts)
 */

export interface SuperAdminDTO {
  id: number | string;
  ad?: string;
  soyad?: string;
  adSoyad: string;
  email: string;
  rol?: string;
  durum?: 'Aktif' | 'Pasif' | string;
  aktifMi?: boolean;
}

export interface RoleDTO {
  id: number | string;
  name: string;
  ad?: string;
  description?: string;
  aciklama?: string;
  isSystemRole?: boolean;
  userCount?: number;
  permissionKeys?: string[];
  permissions?: Record<string, boolean> | string[];
}

export interface UserAuthUserDTO {
  id: number | string;
  ad: string;
  soyad: string;
  adSoyad?: string;
  email: string;
  telefon?: string;
  rolId?: number | string;
  rolAdi?: string;
  aktifMi?: boolean;
  durum?: string;
}

export interface IUserAuthServiceAdapter {
  // Süper Admin / Platform Seviyesi
  getSuperAdmins(): Promise<SuperAdminDTO[]>;
  createSuperAdmin(data: any): Promise<SuperAdminDTO>;
  updateSuperAdmin(id: number | string, data: any): Promise<SuperAdminDTO>;
  deleteSuperAdmin(id: number | string): Promise<void>;

  // Rol ve Yetki Seviyesi
  getRoles(): Promise<RoleDTO[]>;
  getRoleById?(id: number | string): Promise<RoleDTO>;
  saveRole(data: any): Promise<RoleDTO>;
  deleteRole(id: number | string): Promise<void>;
  canDeleteRole?(id: number | string): Promise<boolean>;

  // Kullanıcılar & Personel Seviyesi
  getUsers?(params?: any): Promise<UserAuthUserDTO[]>;
  getUserById?(id: number | string): Promise<UserAuthUserDTO>;
  saveUser?(data: any): Promise<UserAuthUserDTO>;
  deleteUser?(id: number | string): Promise<void>;
}

export interface CreateUserAuthModuleOptions {
  id?: string;
  appName?: string;
  baseRoute?: string;
  superAdminRoute?: string;
  rolesRoute?: string;
  usersRoute?: string;
  adapter?: IUserAuthServiceAdapter;
  onNotify?: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  order?: number;
}

/**
 * @akalin/user_auth_module - Tip Tanımları (types.ts)
 * Kullanıcı Yönetimi, Rol & Yetkiler ve Merkezi Kimlik Doğrulama (Login) tiplerini içerir.
 */

import type React from 'react';

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

export interface UserAuthAgentCredentialsConfig {
  email: string;
  password: string;
  panelTitle?: string;
  statusLabel?: string;
  quickLoginText?: string;
  fillFormText?: string;
}

export interface UserAuthSelectableCompany {
  id: number | string;
  name: string;
  subtitle?: string;
  subDomain?: string;
  raw?: any;
}

export interface UserAuthSelectableBranch {
  id: number | string;
  name: string;
  code?: string;
  subtitle?: string;
  raw?: any;
}

export type UserAuthLoginStepResult =
  | {
      success: true;
      message?: string;
    }
  | {
      success: false;
      message?: string;
    }
  | {
      step: 'select-company';
      companies: UserAuthSelectableCompany[];
      isBiometric?: boolean;
    }
  | {
      step: 'select-branch';
      branches: UserAuthSelectableBranch[];
      companyId?: number | string | null;
    }
  | {
      step: 'create-company';
    };

export interface UserAuthCreateCompanyRenderContext {
  email: string;
  password: string;
  rememberMe: boolean;
  setCredentials: (email: string, password: string) => void;
  onCancel: () => void;
  setError: (message: string) => void;
}

export interface UserAuthLoginPageProps {
  title?: string;
  subtitle?: string;
  brandIcon?: React.ReactNode;
  submitText?: string;
  submittingText?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  defaultEmail?: string;
  defaultPassword?: string;
  showRememberMe?: boolean;
  defaultRememberMe?: boolean;
  rememberEmailKey?: string;
  rememberFlagKey?: string;
  showPasswordToggle?: boolean;
  showThemeToggle?: boolean;
  theme?: string;
  onToggleTheme?: () => void;
  showLanguageToggle?: boolean;
  agentCredentials?: UserAuthAgentCredentialsConfig | false;
  onLogin?: (credentials: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => Promise<UserAuthLoginStepResult>;
  onForgotPassword?: (
    email: string
  ) => Promise<{ message?: string | null; temporaryPassword?: string | null } | void>;
  forgotPasswordText?: string;
  onBiometricLogin?: (payload: {
    email: string;
    rememberMe: boolean;
    companyId?: number | string | null;
  }) => Promise<UserAuthLoginStepResult>;
  biometricButtonText?: string;
  onSelectCompany?: (
    companyId: number | string,
    context: {
      email: string;
      password: string;
      rememberMe: boolean;
      isBiometric: boolean;
    }
  ) => Promise<UserAuthLoginStepResult>;
  onSelectBranch?: (
    branchId: number | string,
    context: {
      companyId: number | string | null;
      email: string;
      password: string;
      rememberMe: boolean;
    }
  ) => Promise<UserAuthLoginStepResult>;
  allowCreateCompany?: boolean;
  createCompanyButtonText?: string;
  companyDomainSuffix?: string;
  renderCreateCompanyForm?: (context: UserAuthCreateCompanyRenderContext) => React.ReactNode;
  footerNote?: React.ReactNode;
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

  // Kimlik Doğrulama (Opsiyonel Adapter Seviyesi Login)
  login?(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<UserAuthLoginStepResult>;
}

export interface CreateUserAuthModuleOptions {
  id?: string;
  appName?: string;
  baseRoute?: string;
  superAdminRoute?: string;
  rolesRoute?: string;
  usersRoute?: string;
  loginRoute?: string | false;
  loginPageProps?: Partial<UserAuthLoginPageProps>;
  adapter?: IUserAuthServiceAdapter;
  onNotify?: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  order?: number;
  isCore?: boolean;
}

export interface CreateAuthModuleOptions {
  id?: string;
  title?: string;
  loginRoute?: string;
  order?: number;
  isCore?: boolean;
  loginPageComponent?: React.ComponentType<any>;
  loginPageProps?: Partial<UserAuthLoginPageProps>;
}

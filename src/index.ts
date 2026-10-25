/**
 * @akalin/user_auth_module - Ana Giriş Noktası (index.ts)
 * Kullanıcı, Rol, Yetki ve Süper Admin bağımsız modül paketi.
 */

// Tipler
export * from './types';

// Modül Fabrikası ve Manifest
export { createUserAuthModule, KullaniciVeYetkiModule, default } from './createUserAuthModule';

// Adapter & Context
export {
  createRestUserAuthAdapter,
  createLocalStorageUserAuthAdapter,
  UserAuthModuleContext,
  UserAuthModuleProvider,
  useUserAuthModule,
  setGlobalUserAuthModuleConfig,
  type UserAuthModuleContextValue
} from './adapters/UserAuthServiceContext';

// Sayfalar
export { default as SuperAdminListPage, default as KullanicilarPage } from './pages/SuperAdminListPage';
export { default as RolVeYetkilerPage } from './pages/RolVeYetkilerPage';

// Bileşenler
export { default as RolForm, RolForm as RolFormComponent } from './components/RolForm';

// Varsayılan Veriler
export {
  DEFAULT_SAMPLE_SUPER_ADMINS,
  DEFAULT_SAMPLE_ROLES,
  DEFAULT_SAMPLE_PERSONNEL
} from './defaults/defaultRoles';

// Doğrulayıcılar (Validators)
export { validateRolForm, validateRolField, type RolFormData } from './validators/rolValidation';
export { validateSuperAdminForm, type SuperAdminFormData } from './validators/superAdminValidation';
export { validateKullaniciForm, type KullaniciFormData } from './validators/kullaniciValidation';

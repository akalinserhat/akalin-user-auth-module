/**
 * @akalin/user_auth_module - Ana Giriş Noktası (index.ts)
 * Kullanıcı, Rol, Yetki, Süper Admin ve Merkezi Kimlik Doğrulama (Login) bağımsız modül paketi.
 */

import './styles/userAuthLogin.css';

// Tipler
export * from './types';

// Modül Fabrikaları ve Manifestler (@akalin/module_management uyumlu)
export {
  createUserAuthModule,
  KullaniciVeYetkiModule,
  createAuthModule,
  AuthModule,
  default
} from './createUserAuthModule';

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
export {
  default as LoginPage,
  UserAuthLoginPage
} from './pages/LoginPage';
export {
  default as SuperAdminListPage,
  default as KullanicilarPage
} from './pages/SuperAdminListPage';
export { default as RolVeYetkilerPage } from './pages/RolVeYetkilerPage';

// Bileşenler
export { default as RolForm, RolForm as RolFormComponent } from './components/RolForm';

// Varsayılan Veriler & Giriş Başlangıç Değerleri
export {
  DEFAULT_SAMPLE_SUPER_ADMINS,
  DEFAULT_SAMPLE_ROLES,
  DEFAULT_SAMPLE_PERSONNEL
} from './defaults/defaultRoles';
export {
  getLoginDefaultValues,
  persistRememberedLogin,
  type UserAuthLoginFormState,
  type UserAuthLoginDefaultOptions
} from './defaults/loginDefaultValue';

// Doğrulayıcılar (Validators)
export { validateRolForm, validateRolField, type RolFormData } from './validators/rolValidation';
export {
  validateSuperAdminForm,
  type SuperAdminFormData
} from './validators/superAdminValidation';
export {
  validateKullaniciForm,
  type KullaniciFormData
} from './validators/kullaniciValidation';
export {
  validateUserAuthLoginField,
  validateUserAuthLoginForm,
  validateUserAuthEmailAction
} from './validators/loginValidation';

// Kancalar (Hooks) & i18n
export { useLoginAutoFocus } from './hooks/useLoginAutoFocus';
export {
  USER_AUTH_LOGIN_TRANSLATIONS,
  createAuthTranslator,
  type SupportedAuthLocale
} from './i18n/authTranslations';

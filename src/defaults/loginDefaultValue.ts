/**
 * @akalin/user_auth_module - Giriş Formu Varsayılan Başlangıç Değerleri (loginDefaultValue.ts)
 * "Beni Hatırla" anahtarlarını ve proje bazlı varsayılan e-posta/şifre değerlerini çözümler.
 */

export interface UserAuthLoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface UserAuthLoginDefaultOptions {
  rememberEmailKey?: string;
  rememberFlagKey?: string;
  defaultEmail?: string;
  defaultPassword?: string;
  defaultRememberMe?: boolean;
}

export function getLoginDefaultValues(
  options: UserAuthLoginDefaultOptions = {}
): UserAuthLoginFormState {
  const {
    rememberEmailKey = 'rememberedEmail',
    rememberFlagKey = 'beniHatirla',
    defaultEmail = '',
    defaultPassword = '',
    defaultRememberMe = false
  } = options;

  if (typeof window === 'undefined') {
    return {
      email: defaultEmail,
      password: defaultPassword,
      rememberMe: defaultRememberMe
    };
  }

  const storedRememberFlag = localStorage.getItem(rememberFlagKey);
  const rememberMe =
    storedRememberFlag !== null ? storedRememberFlag === 'true' : defaultRememberMe;
  const rememberedEmail = localStorage.getItem(rememberEmailKey);

  return {
    email: rememberedEmail || defaultEmail,
    password: defaultPassword,
    rememberMe
  };
}

export function persistRememberedLogin(
  email: string,
  rememberMe: boolean,
  options: Pick<UserAuthLoginDefaultOptions, 'rememberEmailKey' | 'rememberFlagKey'> = {}
): void {
  if (typeof window === 'undefined') return;
  const rememberEmailKey = options.rememberEmailKey || 'rememberedEmail';
  const rememberFlagKey = options.rememberFlagKey || 'beniHatirla';

  if (rememberMe) {
    localStorage.setItem(rememberEmailKey, email.trim());
    localStorage.setItem(rememberFlagKey, 'true');
  } else {
    localStorage.removeItem(rememberEmailKey);
    localStorage.removeItem(rememberFlagKey);
  }
}

/**
 * @akalin/user_auth_module - Giriş Formu Doğrulayıcısı (loginValidation.ts)
 * Sıfır satır içi (inline) form doğrulama politikası gereği tüm alan ve
 * form doğrulamaları bu saf (pure) TypeScript fonksiyonlarında yürütülür.
 */

import type { UserAuthLoginFormState } from '../defaults/loginDefaultValue';

const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUserAuthLoginField(
  fieldName: keyof UserAuthLoginFormState,
  value: string | boolean,
  translate: (key: string) => string
): string {
  if (fieldName === 'email') {
    const emailVal = String(value ?? '').trim();
    if (!emailVal) {
      return translate('user_auth.login.validation.email_required');
    }
    if (!EMAIL_FORMAT_REGEX.test(emailVal)) {
      return translate('user_auth.login.validation.email_invalid');
    }
    return '';
  }

  if (fieldName === 'password') {
    const passwordVal = String(value ?? '');
    if (!passwordVal.trim()) {
      return translate('user_auth.login.validation.password_required');
    }
    return '';
  }

  return '';
}

export function validateUserAuthLoginForm(
  formData: UserAuthLoginFormState,
  translate: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const emailErr = validateUserAuthLoginField('email', formData.email, translate);
  if (emailErr) {
    errors.email = emailErr;
  }

  const passwordErr = validateUserAuthLoginField('password', formData.password, translate);
  if (passwordErr) {
    errors.password = passwordErr;
  }

  return errors;
}

export function validateUserAuthEmailAction(
  email: string,
  action: 'biometric' | 'reset-password',
  translate: (key: string) => string
): Record<string, string> {
  const trimmed = String(email ?? '').trim();
  if (!trimmed) {
    return {
      email:
        action === 'biometric'
          ? translate('user_auth.login.validation.biometric_email_required')
          : translate('user_auth.login.validation.reset_email_required')
    };
  }
  if (!EMAIL_FORMAT_REGEX.test(trimmed)) {
    return {
      email: translate('user_auth.login.validation.email_invalid')
    };
  }
  return {};
}

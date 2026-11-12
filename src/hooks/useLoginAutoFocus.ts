/**
 * @akalin/user_auth_module - Giriş Formu Otomatik Odaklanma Kancası (useLoginAutoFocus.ts)
 * Form açıldığında ilk etkin alana (e-posta doluysa şifre alanına, boşsa e-posta alanına)
 * otomatik olarak odaklanır.
 */

import { useEffect, type RefObject } from 'react';

export function useLoginAutoFocus(
  emailInputRef: RefObject<HTMLInputElement | null>,
  passwordInputRef: RefObject<HTMLInputElement | null>,
  initialEmail: string
): void {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (initialEmail.trim() && passwordInputRef.current && !passwordInputRef.current.disabled) {
        passwordInputRef.current.focus();
      } else if (emailInputRef.current && !emailInputRef.current.disabled) {
        emailInputRef.current.focus();
      }
    }, 30);

    return () => window.clearTimeout(timer);
    // Yalnızca ilk açılışta çalışır
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

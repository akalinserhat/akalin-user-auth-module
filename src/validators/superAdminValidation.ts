/**
 * @akalin/user_auth_module - Süper Admin Doğrulama (superAdminValidation.ts)
 */

export interface SuperAdminFormData {
  ad: string;
  soyad: string;
  email: string;
  sifre?: string;
  aktifMi?: boolean;
}

export const validateSuperAdminForm = (
  data: SuperAdminFormData,
  isEditing: boolean = false,
  t?: any
): Record<string, string> => {
  const translate = typeof t === 'function' ? t : ((_k: string, f?: string) => f || '');
  const errors: Record<string, string> = {};

  if (!data.ad || !data.ad.trim()) {
    errors.ad = translate('ad_zorunludur', 'Ad alanı zorunludur.');
  }

  if (!data.soyad || !data.soyad.trim()) {
    errors.soyad = translate('soyad_zorunludur', 'Soyad alanı zorunludur.');
  }

  if (!data.email || !data.email.trim()) {
    errors.email = translate('eposta_zorunludur', 'E-posta alanı zorunludur.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = translate('gecersiz_eposta', 'Geçerli bir e-posta adresi giriniz.');
  }

  if (!isEditing && (!data.sifre || data.sifre.trim().length < 6)) {
    errors.sifre = translate('sifre_en_az_6_karakter', 'Şifre en az 6 karakter olmalıdır.');
  }

  return errors;
};

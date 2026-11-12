/**
 * @akalin/user_auth_module - Çok Dilli (i18n) Giriş Ekranı Çeviri Sözlüğü (authTranslations.ts)
 * Ev sahibi (host) uygulamanın i18next t() fonksiyonunu kullanır; ilgili anahtar host
 * projenin JSON sözlüğünde tanımlı değilse aktif dile (tr / en) uygun yerleşik karşılığını döndürür.
 */

export type SupportedAuthLocale = 'tr' | 'en';

export const USER_AUTH_LOGIN_TRANSLATIONS: Record<SupportedAuthLocale, Record<string, string>> = {
  tr: {
    'user_auth.login.title': 'Sisteme Giriş',
    'user_auth.login.subtitle': 'Devam etmek için hesabınıza giriş yapın.',
    'user_auth.login.email_label': 'E-Posta',
    'user_auth.login.email_placeholder': 'E-posta adresinizi girin',
    'user_auth.login.password_label': 'Şifre',
    'user_auth.login.password_placeholder': 'Şifrenizi girin',
    'user_auth.login.show_password': 'Şifreyi Göster',
    'user_auth.login.hide_password': 'Şifreyi Gizle',
    'user_auth.login.remember_me': 'Beni Hatırla',
    'user_auth.login.forgot_password': 'Şifremi Unuttum',
    'user_auth.login.sending_reset': 'Gönderiliyor...',
    'user_auth.login.submit': 'Giriş Yap',
    'user_auth.login.submitting': 'Giriş Yapılıyor...',
    'user_auth.login.or_divider': 'VEYA',
    'user_auth.login.biometric_button': 'Parmak İzi / Yüz Tanıma ile Giriş',
    'user_auth.login.create_workspace_link': 'Yeni Firma / Çalışma Alanı Oluştur',
    'user_auth.login.create_another_workspace': '+ Yeni Bir Firma Daha Oluştur',
    'user_auth.login.select_company_title': 'Çalışma Alanınızı Seçin',
    'user_auth.login.select_company_subtitle': 'İşlem yapmak istediğiniz firmayı seçin.',
    'user_auth.login.empty_company_title': 'Çalışma Alanınızı Oluşturun',
    'user_auth.login.empty_company_subtitle': 'Hesabınıza tanımlı aktif bir firma bulunamadı.',
    'user_auth.login.empty_company_heading': 'Firma Bulunamadı',
    'user_auth.login.create_company_title': 'Yeni Çalışma Alanı',
    'user_auth.login.create_company_subtitle': 'Firma detaylarınızı girerek işlemlerinize başlayın.',
    'user_auth.login.create_company_cta': 'Yeni Firma Oluştur',
    'user_auth.login.select_branch_title': 'Şube Seçimi',
    'user_auth.login.select_branch_subtitle': 'Lütfen işlem yapmak istediğiniz şubeyi seçin.',
    'user_auth.login.branch_code_prefix': 'Kod:',
    'user_auth.login.switch_account': 'Farklı Hesapla Giriş Yap',
    'user_auth.login.go_back': 'Geri Dön',
    'user_auth.login.agent_panel_title': 'Agent / Test Girişi',
    'user_auth.login.agent_ready': 'Hazır',
    'user_auth.login.agent_quick_login': 'Agent Girişi Yap',
    'user_auth.login.agent_fill_form': 'Forma Doldur',
    'user_auth.login.light_mode': 'Aydınlık',
    'user_auth.login.dark_mode': 'Karanlık',
    'user_auth.login.toggle_language': 'Dili Değiştir',
    'user_auth.login.error_generic': 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.',
    'user_auth.login.validation.email_required': 'E-posta adresi zorunludur.',
    'user_auth.login.validation.email_invalid': 'Lütfen geçerli bir e-posta adresi giriniz.',
    'user_auth.login.validation.password_required': 'Şifre alanı zorunludur.',
    'user_auth.login.validation.biometric_email_required': 'Lütfen biyometrik doğrulama öncesi e-posta adresinizi girin.',
    'user_auth.login.validation.reset_email_required': 'Şifre sıfırlama bağlantısı için lütfen e-posta adresinizi girin.'
  },
  en: {
    'user_auth.login.title': 'Sign In',
    'user_auth.login.subtitle': 'Sign in to your account to continue.',
    'user_auth.login.email_label': 'Email',
    'user_auth.login.email_placeholder': 'Enter your email address',
    'user_auth.login.password_label': 'Password',
    'user_auth.login.password_placeholder': 'Enter your password',
    'user_auth.login.show_password': 'Show Password',
    'user_auth.login.hide_password': 'Hide Password',
    'user_auth.login.remember_me': 'Remember Me',
    'user_auth.login.forgot_password': 'Forgot Password',
    'user_auth.login.sending_reset': 'Sending...',
    'user_auth.login.submit': 'Sign In',
    'user_auth.login.submitting': 'Signing In...',
    'user_auth.login.or_divider': 'OR',
    'user_auth.login.biometric_button': 'Sign In with Passkey / Biometrics',
    'user_auth.login.create_workspace_link': 'Create New Company / Workspace',
    'user_auth.login.create_another_workspace': '+ Create Another Company',
    'user_auth.login.select_company_title': 'Select Your Workspace',
    'user_auth.login.select_company_subtitle': 'Choose the company you want to work in.',
    'user_auth.login.empty_company_title': 'Create Your Workspace',
    'user_auth.login.empty_company_subtitle': 'No active company is linked to your account yet.',
    'user_auth.login.empty_company_heading': 'No Company Found',
    'user_auth.login.create_company_title': 'New Workspace',
    'user_auth.login.create_company_subtitle': 'Enter your company details to get started.',
    'user_auth.login.create_company_cta': 'Create New Company',
    'user_auth.login.select_branch_title': 'Select Branch',
    'user_auth.login.select_branch_subtitle': 'Please select the branch you want to access.',
    'user_auth.login.branch_code_prefix': 'Code:',
    'user_auth.login.switch_account': 'Sign In with Another Account',
    'user_auth.login.go_back': 'Go Back',
    'user_auth.login.agent_panel_title': 'Agent / Test Login',
    'user_auth.login.agent_ready': 'Ready',
    'user_auth.login.agent_quick_login': 'Quick Agent Login',
    'user_auth.login.agent_fill_form': 'Fill Form',
    'user_auth.login.light_mode': 'Light',
    'user_auth.login.dark_mode': 'Dark',
    'user_auth.login.toggle_language': 'Switch Language',
    'user_auth.login.error_generic': 'Unable to sign in. Please verify your credentials.',
    'user_auth.login.validation.email_required': 'Email address is required.',
    'user_auth.login.validation.email_invalid': 'Please enter a valid email address.',
    'user_auth.login.validation.password_required': 'Password is required.',
    'user_auth.login.validation.biometric_email_required': 'Please enter your email address before biometric sign-in.',
    'user_auth.login.validation.reset_email_required': 'Please enter your email address to reset your password.'
  }
};

export function createAuthTranslator(
  t: (key: string, defaultValue?: any) => string,
  language?: string
): (key: string) => string {
  const lang: SupportedAuthLocale =
    typeof language === 'string' && language.toLowerCase().startsWith('en') ? 'en' : 'tr';

  return (key: string): string => {
    const fallback =
      USER_AUTH_LOGIN_TRANSLATIONS[lang][key] ||
      USER_AUTH_LOGIN_TRANSLATIONS.tr[key] ||
      key;
    const translated = t(key, fallback);
    return translated === key ? fallback : translated;
  };
}

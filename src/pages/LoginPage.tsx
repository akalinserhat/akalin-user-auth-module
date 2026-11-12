/**
 * @akalin/user_auth_module - Merkezi Kimlik Doğrulama (Login) Sayfası (LoginPage.tsx)
 * Webakus.UI, Webakus.AdminUI, ThinkPort API ve Studio (Builder) uygulamalarında
 * ortak kullanılan; tek adımlı giriş, şifremi unuttum, biyometrik (WebAuthn) doğrulama,
 * çoklu firma / şube seçimi, yeni çalışma alanı oluşturma ve Agent/Test hızlı giriş
 * akışlarını @akalin/ui bileşenleri ve sıfır satır içi CSS / sıfır satır içi validasyon
 * mimarisiyle sunan standart giriş ekranı.
 */

import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  Fingerprint,
  Globe,
  Lock,
  LogIn,
  Mail,
  MapPin,
  Moon,
  Plus,
  Sun,
  Zap
} from 'lucide-react';
import {
  BaseButton,
  BaseCard,
  BaseInput,
  BaseSwitch,
  FieldError,
  useAdminValidation
} from '@akalin/ui';
import '../styles/userAuthLogin.css';
import {
  type UserAuthLoginPageProps,
  type UserAuthLoginStepResult,
  type UserAuthSelectableBranch,
  type UserAuthSelectableCompany
} from '../types';
import { createAuthTranslator } from '../i18n/authTranslations';
import {
  getLoginDefaultValues,
  persistRememberedLogin,
  type UserAuthLoginFormState
} from '../defaults/loginDefaultValue';
import {
  validateUserAuthEmailAction,
  validateUserAuthLoginField,
  validateUserAuthLoginForm
} from '../validators/loginValidation';
import { useLoginAutoFocus } from '../hooks/useLoginAutoFocus';
import { useUserAuthModule } from '../adapters/UserAuthServiceContext';

type LoginFlowStep = 'credentials' | 'select-company' | 'select-branch' | 'create-company';

export const UserAuthLoginPage: React.FC<UserAuthLoginPageProps> = ({
  title,
  subtitle,
  brandIcon,
  submitText,
  submittingText,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  defaultEmail,
  defaultPassword,
  showRememberMe = true,
  defaultRememberMe = false,
  rememberEmailKey = 'rememberedEmail',
  rememberFlagKey = 'beniHatirla',
  showPasswordToggle = true,
  showThemeToggle = false,
  theme,
  onToggleTheme,
  showLanguageToggle = false,
  agentCredentials = false,
  onLogin,
  onForgotPassword,
  forgotPasswordText,
  onBiometricLogin,
  biometricButtonText,
  onSelectCompany,
  onSelectBranch,
  allowCreateCompany = false,
  createCompanyButtonText,
  companyDomainSuffix = '.webakus.com',
  renderCreateCompanyForm,
  footerNote
}) => {
  const { t, i18n } = useTranslation();
  const trAuth = useMemo(
    () => createAuthTranslator(t as any, i18n?.language),
    [t, i18n?.language]
  );
  const { adapter } = useUserAuthModule();

  const initialDefaults = useMemo(
    () =>
      getLoginDefaultValues({
        rememberEmailKey,
        rememberFlagKey,
        defaultEmail,
        defaultPassword,
        defaultRememberMe
      }),
    [rememberEmailKey, rememberFlagKey, defaultEmail, defaultPassword, defaultRememberMe]
  );

  const [formData, setFormData] = useState<UserAuthLoginFormState>(initialDefaults);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [bannerError, setBannerError] = useState('');
  const [bannerSuccess, setBannerSuccess] = useState('');

  // Çok adımlı giriş durumları (Firma / Şube / Yeni Çalışma Alanı)
  const [step, setStep] = useState<LoginFlowStep>('credentials');
  const [companies, setCompanies] = useState<UserAuthSelectableCompany[]>([]);
  const [branches, setBranches] = useState<UserAuthSelectableBranch[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | string | null>(null);
  const [isBiometricFlow, setIsBiometricFlow] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useLoginAutoFocus(emailInputRef, passwordInputRef, initialDefaults.email);

  const { errors, setErrors, clearError, clearErrors, setFieldError, validate } =
    useAdminValidation();

  const activeLangCode =
    typeof i18n?.language === 'string' && i18n.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'tr';

  const resolvedIsDark = useMemo(() => {
    if (theme) {
      return theme === 'dark';
    }
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') === 'dark';
    }
    return false;
  }, [theme]);

  const handleToggleLanguage = () => {
    if (!i18n?.changeLanguage) return;
    const nextLang = activeLangCode === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', nextLang);
    }
  };

  const handleDefaultToggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
      return;
    }
    if (typeof document !== 'undefined') {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    }
  };

  const applyStepResult = (
    result: UserAuthLoginStepResult,
    effectiveEmail: string,
    effectiveRemember: boolean
  ) => {
    if ('step' in result) {
      setBannerError('');
      setBannerSuccess('');
      if (result.step === 'select-company') {
        setCompanies(result.companies || []);
        setIsBiometricFlow(Boolean(result.isBiometric));
        setStep('select-company');
        return;
      }
      if (result.step === 'select-branch') {
        setBranches(result.branches || []);
        if (result.companyId !== undefined) {
          setSelectedCompanyId(result.companyId);
        }
        setStep('select-branch');
        return;
      }
      if (result.step === 'create-company') {
        setStep('create-company');
        return;
      }
    }

    if (result.success) {
      persistRememberedLogin(effectiveEmail, effectiveRemember, {
        rememberEmailKey,
        rememberFlagKey
      });
      setBannerError('');
      if (result.message) {
        setBannerSuccess(result.message);
      }
      return;
    }

    setBannerSuccess('');
    setBannerError(result.message || trAuth('user_auth.login.error_generic'));
  };

  const executeLogin = async (
    targetEmail: string,
    targetPassword: string,
    targetRemember: boolean
  ) => {
    const payload: UserAuthLoginFormState = {
      email: targetEmail,
      password: targetPassword,
      rememberMe: targetRemember
    };

    const isValid = validate(validateUserAuthLoginForm, payload, trAuth);
    if (!isValid) {
      return;
    }

    const loginHandler = onLogin || adapter?.login;
    if (!loginHandler) {
      setBannerError(trAuth('user_auth.login.error_generic'));
      return;
    }

    setBannerError('');
    setBannerSuccess('');
    setIsSubmitting(true);

    try {
      const result = await loginHandler({
        email: targetEmail.trim(),
        password: targetPassword,
        rememberMe: targetRemember
      });
      applyStepResult(result, targetEmail, targetRemember);
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        trAuth('user_auth.login.error_generic');
      setBannerError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(formData.email, formData.password, formData.rememberMe);
  };

  const handleAgentFill = () => {
    if (!agentCredentials) return;
    setFormData((prev) => ({
      ...prev,
      email: agentCredentials.email,
      password: agentCredentials.password
    }));
    clearErrors();
    setBannerError('');
    setBannerSuccess('');
  };

  const handleAgentQuickLogin = async () => {
    if (!agentCredentials) return;
    setFormData((prev) => ({
      ...prev,
      email: agentCredentials.email,
      password: agentCredentials.password
    }));
    clearErrors();
    await executeLogin(agentCredentials.email, agentCredentials.password, formData.rememberMe);
  };

  const handleForgotPasswordClick = async () => {
    if (!onForgotPassword) return;
    const emailErrors = validateUserAuthEmailAction(formData.email, 'reset-password', trAuth);
    if (Object.keys(emailErrors).length > 0) {
      setErrors(emailErrors);
      emailInputRef.current?.focus();
      return;
    }

    setBannerError('');
    setBannerSuccess('');
    setIsResettingPassword(true);
    try {
      const response = await onForgotPassword(formData.email.trim());
      if (response && typeof response === 'object') {
        if (response.temporaryPassword) {
          setFormData((prev) => ({ ...prev, password: response.temporaryPassword || '' }));
        }
        if (response.message) {
          setBannerSuccess(response.message);
        }
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        trAuth('user_auth.login.error_generic');
      setBannerError(errMsg);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleBiometricClick = async () => {
    if (!onBiometricLogin) return;
    const emailErrors = validateUserAuthEmailAction(formData.email, 'biometric', trAuth);
    if (Object.keys(emailErrors).length > 0) {
      setErrors(emailErrors);
      emailInputRef.current?.focus();
      return;
    }

    setBannerError('');
    setBannerSuccess('');
    setIsSubmitting(true);
    try {
      const result = await onBiometricLogin({
        email: formData.email.trim(),
        rememberMe: formData.rememberMe
      });
      applyStepResult(result, formData.email, formData.rememberMe);
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        trAuth('user_auth.login.error_generic');
      setBannerError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanySelect = async (companyId: number | string) => {
    if (!onSelectCompany || isSubmitting) return;
    setSelectedCompanyId(companyId);
    setBannerError('');
    setIsSubmitting(true);
    try {
      const result = await onSelectCompany(companyId, {
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe,
        isBiometric: isBiometricFlow
      });
      applyStepResult(result, formData.email, formData.rememberMe);
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        trAuth('user_auth.login.error_generic');
      setBannerError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBranchSelect = async (branchId: number | string) => {
    if (!onSelectBranch || isSubmitting) return;
    setBannerError('');
    setIsSubmitting(true);
    try {
      const result = await onSelectBranch(branchId, {
        companyId: selectedCompanyId,
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      applyStepResult(result, formData.email, formData.rememberMe);
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        trAuth('user_auth.login.error_generic');
      setBannerError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetToCredentials = () => {
    setStep('credentials');
    setCompanies([]);
    setBranches([]);
    setSelectedCompanyId(null);
    setIsBiometricFlow(false);
    setBannerError('');
    setBannerSuccess('');
  };

  const resolvedTitle = useMemo(() => {
    if (step === 'select-company') {
      return companies.length > 0
        ? trAuth('user_auth.login.select_company_title')
        : trAuth('user_auth.login.empty_company_title');
    }
    if (step === 'select-branch') {
      return trAuth('user_auth.login.select_branch_title');
    }
    if (step === 'create-company') {
      return trAuth('user_auth.login.create_company_title');
    }
    return title || trAuth('user_auth.login.title');
  }, [step, companies.length, title, trAuth]);

  const resolvedSubtitle = useMemo(() => {
    if (step === 'select-company') {
      return companies.length > 0
        ? trAuth('user_auth.login.select_company_subtitle')
        : trAuth('user_auth.login.empty_company_subtitle');
    }
    if (step === 'select-branch') {
      return trAuth('user_auth.login.select_branch_subtitle');
    }
    if (step === 'create-company') {
      return trAuth('user_auth.login.create_company_subtitle');
    }
    return subtitle || trAuth('user_auth.login.subtitle');
  }, [step, companies.length, subtitle, trAuth]);

  const isWideCard = step !== 'credentials';

  return (
    <div className="ua-login-page">
      {(showLanguageToggle || showThemeToggle) && (
        <div className="ua-login-topbar">
          {showLanguageToggle && (
            <BaseButton
              type="button"
              variant="outline"
              className="ua-topbar-btn"
              icon={<Globe size={15} />}
              text={activeLangCode === 'tr' ? 'EN' : 'TR'}
              title={trAuth('user_auth.login.toggle_language')}
              onClick={handleToggleLanguage}
            />
          )}
          {showThemeToggle && (
            <BaseButton
              type="button"
              variant="outline"
              className="ua-topbar-btn"
              icon={resolvedIsDark ? <Sun size={15} /> : <Moon size={15} />}
              text={
                resolvedIsDark
                  ? trAuth('user_auth.login.light_mode')
                  : trAuth('user_auth.login.dark_mode')
              }
              onClick={handleDefaultToggleTheme}
            />
          )}
        </div>
      )}

      <div className={`ua-login-card ${isWideCard ? 'ua-login-card--wide' : ''}`}>
        <div className="ua-login-brand">
          <div className="ua-login-brand-icon">{brandIcon || <Lock size={26} />}</div>
          <h1 className="ua-login-title">{resolvedTitle}</h1>
          <p className="ua-login-subtitle">{resolvedSubtitle}</p>
        </div>

        {bannerError && (
          <div className="ua-login-banner ua-login-banner--error" role="alert">
            <AlertCircle size={18} className="ua-login-banner-icon" />
            <span>{bannerError}</span>
          </div>
        )}

        {bannerSuccess && (
          <div className="ua-login-banner ua-login-banner--success" role="status">
            <CheckCircle2 size={18} className="ua-login-banner-icon" />
            <span>{bannerSuccess}</span>
          </div>
        )}

        {step === 'credentials' && (
          <form className="ua-login-form" onSubmit={handleSubmit} noValidate>
            {agentCredentials && (
              <div className="agent-login-card" id="agent-credentials-box">
                <div className="agent-login-header">
                  <span className="agent-login-badge">
                    <Bot size={15} />
                    {agentCredentials.panelTitle || trAuth('user_auth.login.agent_panel_title')}
                  </span>
                  <span className="agent-login-status-tag">
                    {agentCredentials.statusLabel || trAuth('user_auth.login.agent_ready')}
                  </span>
                </div>

                <div className="agent-credentials-grid">
                  <div className="agent-credential-item">
                    <span className="agent-credential-label">
                      {emailLabel || trAuth('user_auth.login.email_label')}
                    </span>
                    <span className="agent-credential-value" id="agent-email-display">
                      {agentCredentials.email}
                    </span>
                  </div>
                  <div className="agent-credential-item">
                    <span className="agent-credential-label">
                      {passwordLabel || trAuth('user_auth.login.password_label')}
                    </span>
                    <span className="agent-credential-value" id="agent-password-display">
                      {agentCredentials.password}
                    </span>
                  </div>
                </div>

                <div className="agent-login-actions">
                  <BaseButton
                    type="button"
                    id="btn-agent-login"
                    variant="primary"
                    className="ua-agent-primary-btn"
                    icon={<Zap size={14} />}
                    text={
                      agentCredentials.quickLoginText ||
                      trAuth('user_auth.login.agent_quick_login')
                    }
                    loadingText={submittingText || trAuth('user_auth.login.submitting')}
                    isSaving={isSubmitting}
                    onClick={handleAgentQuickLogin}
                  />
                  <BaseButton
                    type="button"
                    id="btn-agent-fill"
                    variant="outline"
                    className="ua-agent-fill-btn"
                    icon={<Copy size={14} />}
                    text={
                      agentCredentials.fillFormText || trAuth('user_auth.login.agent_fill_form')
                    }
                    disabled={isSubmitting}
                    onClick={handleAgentFill}
                  />
                </div>
              </div>
            )}

            <div className="ua-field-box">
              <label className="ua-field-label" htmlFor="login-email">
                {emailLabel || trAuth('user_auth.login.email_label')}
              </label>
              <BaseInput
                id="login-email"
                name="email"
                type="email"
                casing="girildigiGibi"
                ref={emailInputRef}
                autoComplete="username"
                icon={<Mail size={18} />}
                placeholder={emailPlaceholder || trAuth('user_auth.login.email_placeholder')}
                value={formData.email}
                error={Boolean(errors.email)}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({ ...prev, email: val }));
                  if (errors.email) clearError('email');
                }}
                onBlur={() => {
                  if (formData.email) {
                    const msg = validateUserAuthLoginField('email', formData.email, trAuth);
                    if (msg) setFieldError('email', msg);
                  }
                }}
              />
              <FieldError error={errors.email} />
            </div>

            <div className="ua-field-box">
              <label className="ua-field-label" htmlFor="login-password">
                {passwordLabel || trAuth('user_auth.login.password_label')}
              </label>
              <BaseInput
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                casing="girildigiGibi"
                ref={passwordInputRef}
                autoComplete="current-password"
                icon={<Lock size={18} />}
                placeholder={passwordPlaceholder || trAuth('user_auth.login.password_placeholder')}
                value={formData.password}
                error={Boolean(errors.password)}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({ ...prev, password: val }));
                  if (errors.password) clearError('password');
                }}
                rightAdornment={
                  showPasswordToggle ? (
                    <BaseButton
                      type="button"
                      variant="outline"
                      className="ua-password-toggle-btn"
                      tabIndex={-1}
                      icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      title={
                        showPassword
                          ? trAuth('user_auth.login.hide_password')
                          : trAuth('user_auth.login.show_password')
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  ) : undefined
                }
              />
              <FieldError error={errors.password} />
            </div>

            {(showRememberMe || Boolean(onForgotPassword)) && (
              <div
                className={`ua-login-options-row ${
                  !showRememberMe ? 'ua-login-options-row--end' : ''
                }`}
              >
                {showRememberMe && (
                  <BaseSwitch
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }))
                    }
                    label={trAuth('user_auth.login.remember_me')}
                  />
                )}
                {onForgotPassword && (
                  <BaseButton
                    type="button"
                    variant="outline"
                    className="ua-forgot-btn"
                    text={forgotPasswordText || trAuth('user_auth.login.forgot_password')}
                    loadingText={trAuth('user_auth.login.sending_reset')}
                    isSaving={isResettingPassword}
                    disabled={isSubmitting}
                    onClick={handleForgotPasswordClick}
                  />
                )}
              </div>
            )}

            <BaseButton
              id="btn-login-submit"
              type="submit"
              variant="primary"
              className="ua-login-submit-btn"
              icon={<LogIn size={18} />}
              text={submitText || trAuth('user_auth.login.submit')}
              loadingText={submittingText || trAuth('user_auth.login.submitting')}
              isSaving={isSubmitting}
            />

            {onBiometricLogin && (
              <>
                <div className="ua-login-divider">
                  <div className="ua-login-divider-line" />
                  <span className="ua-login-divider-text">
                    {trAuth('user_auth.login.or_divider')}
                  </span>
                  <div className="ua-login-divider-line" />
                </div>

                <BaseButton
                  type="button"
                  variant="outline"
                  className="ua-login-biometric-btn"
                  icon={<Fingerprint size={18} />}
                  text={biometricButtonText || trAuth('user_auth.login.biometric_button')}
                  disabled={isSubmitting}
                  onClick={handleBiometricClick}
                />
              </>
            )}

            {allowCreateCompany && renderCreateCompanyForm && (
              <div className="ua-login-workspace-footer">
                <BaseButton
                  type="button"
                  variant="outline"
                  className="ua-workspace-link-btn"
                  icon={<Plus size={15} />}
                  text={createCompanyButtonText || trAuth('user_auth.login.create_workspace_link')}
                  disabled={isSubmitting}
                  onClick={() => {
                    setBannerError('');
                    setBannerSuccess('');
                    setStep('create-company');
                  }}
                />
              </div>
            )}
          </form>
        )}

        {step === 'select-company' && (
          <div className="ua-selection-step">
            {companies.length > 0 ? (
              <div className="ua-selection-list">
                {companies.map((company) => {
                  const subText =
                    company.subtitle ||
                    (company.subDomain ? `${company.subDomain}${companyDomainSuffix}` : '');
                  return (
                    <BaseCard
                      key={String(company.id)}
                      variant="outlined"
                      interactive
                      role="button"
                      tabIndex={0}
                      className={`ua-selection-item-btn ${
                        isSubmitting ? 'ua-selection-item-btn--disabled' : ''
                      }`}
                      onClick={() => handleCompanySelect(company.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleCompanySelect(company.id);
                        }
                      }}
                    >
                      <div className="ua-selection-item-content">
                        <div className="ua-selection-icon-box">
                          <Building2 size={20} />
                        </div>
                        <div className="ua-selection-texts">
                          <span className="ua-selection-name">{company.name}</span>
                          {subText && <span className="ua-selection-sub">{subText}</span>}
                        </div>
                      </div>
                      <ChevronRight size={18} className="ua-selection-chevron" />
                    </BaseCard>
                  );
                })}

                {allowCreateCompany && renderCreateCompanyForm && (
                  <BaseButton
                    type="button"
                    variant="outline"
                    className="ua-selection-create-btn"
                    icon={<Plus size={16} />}
                    text={trAuth('user_auth.login.create_another_workspace')}
                    disabled={isSubmitting}
                    onClick={() => {
                      setBannerError('');
                      setStep('create-company');
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="ua-empty-workspace">
                <div className="ua-empty-workspace-icon">
                  <Building2 size={28} />
                </div>
                <h3 className="ua-empty-workspace-title">
                  {trAuth('user_auth.login.empty_company_heading')}
                </h3>
                <p className="ua-empty-workspace-desc">
                  {trAuth('user_auth.login.empty_company_subtitle')}
                </p>
                {renderCreateCompanyForm && (
                  <BaseButton
                    type="button"
                    variant="primary"
                    className="ua-login-submit-btn"
                    icon={<Plus size={18} />}
                    text={trAuth('user_auth.login.create_company_cta')}
                    onClick={() => {
                      setBannerError('');
                      setStep('create-company');
                    }}
                  />
                )}
              </div>
            )}

            <BaseButton
              type="button"
              variant="outline"
              className="ua-selection-back-btn"
              icon={<ArrowLeft size={16} />}
              text={trAuth('user_auth.login.switch_account')}
              disabled={isSubmitting}
              onClick={handleResetToCredentials}
            />
          </div>
        )}

        {step === 'select-branch' && (
          <div className="ua-selection-step">
            <div className="ua-selection-list">
              {branches.map((branch) => {
                const subText =
                  branch.subtitle ||
                  (branch.code
                    ? `${trAuth('user_auth.login.branch_code_prefix')} ${branch.code}`
                    : '');
                return (
                  <BaseCard
                    key={String(branch.id)}
                    variant="outlined"
                    interactive
                    role="button"
                    tabIndex={0}
                    className={`ua-selection-item-btn ${
                      isSubmitting ? 'ua-selection-item-btn--disabled' : ''
                    }`}
                    onClick={() => handleBranchSelect(branch.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleBranchSelect(branch.id);
                      }
                    }}
                  >
                    <div className="ua-selection-item-content">
                      <div className="ua-selection-icon-box">
                        <MapPin size={20} />
                      </div>
                      <div className="ua-selection-texts">
                        <span className="ua-selection-name">{branch.name}</span>
                        {subText && <span className="ua-selection-sub">{subText}</span>}
                      </div>
                    </div>
                    <ChevronRight size={18} className="ua-selection-chevron" />
                  </BaseCard>
                );
              })}
            </div>

            <BaseButton
              type="button"
              variant="outline"
              className="ua-selection-back-btn"
              icon={<ArrowLeft size={16} />}
              text={trAuth('user_auth.login.switch_account')}
              disabled={isSubmitting}
              onClick={handleResetToCredentials}
            />
          </div>
        )}

        {step === 'create-company' &&
          renderCreateCompanyForm &&
          renderCreateCompanyForm({
            email: formData.email,
            password: formData.password,
            rememberMe: formData.rememberMe,
            setCredentials: (nextEmail, nextPassword) =>
              setFormData((prev) => ({
                ...prev,
                email: nextEmail,
                password: nextPassword
              })),
            onCancel: () => {
              setBannerError('');
              setStep(companies.length > 0 ? 'select-company' : 'credentials');
            },
            setError: setBannerError
          })}
      </div>

      {footerNote && <div className="ua-login-footer-note">{footerNote}</div>}
    </div>
  );
};

export default UserAuthLoginPage;

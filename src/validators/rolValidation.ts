/**
 * @akalin/user_auth_module - Rol Doğrulama (rolValidation.ts)
 */

export interface RolFormData {
  name: string;
  description?: string;
  permissions?: Record<string, boolean>;
}

export const validateRolField = (
  field: string,
  value: any,
  t?: any
): string | null => {
  const translate = typeof t === 'function' ? t : ((_k: string, f?: string) => f || '');

  switch (field) {
    case 'name':
      if (!value || typeof value !== 'string' || !value.trim()) {
        return translate('rol_adi_zorunludur', 'Rol adı zorunludur.');
      }
      if (value.trim().length < 2) {
        return translate('rol_adi_en_az_2_karakter', 'Rol adı en az 2 karakter olmalıdır.');
      }
      if (value.trim().length > 100) {
        return translate('rol_adi_en_fazla_100_karakter', 'Rol adı en fazla 100 karakter olabilir.');
      }
      return null;
    default:
      return null;
  }
};

export const validateRolForm = (
  formData: RolFormData,
  t?: any
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const nameError = validateRolField('name', formData.name, t);
  if (nameError) {
    errors.name = nameError;
  }

  return errors;
};

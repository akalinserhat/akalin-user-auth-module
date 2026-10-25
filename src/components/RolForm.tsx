/**
 * @akalin/user_auth_module - Rol ve Yetki Tanımlama Formu (RolForm.tsx)
 * @akalin/module_core ModuleRegistry üzerinden dinamik yetki matrisini oluşturur ve rol izinlerini kaydeder.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Save, AlertCircle, Copy, CheckSquare, Square, Check } from 'lucide-react';
import { FieldError } from '@akalin/ui';
import { validateRolField, validateRolForm } from '../validators/rolValidation';
import { ModuleRegistry, type IModulePermissionMatrixGroup } from '@akalin/module_core';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useUserAuthModule } from '../adapters/UserAuthServiceContext';

export interface RolFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export const RolForm = ({ initialData, onSuccess, onCancel, onDirtyChange }: RolFormProps): React.ReactElement => {
  const { t } = useTranslation();
  const { adapter } = useUserAuthModule();
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    permissions: Record<string, boolean>;
  }>({
    name: '',
    description: '',
    permissions: {}
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // ModuleRegistry üzerinden tüm kayıtlı modüllerin yetki matrisini çek
  const matrix: IModulePermissionMatrixGroup[] = useMemo(() => {
    return ModuleRegistry.getPermissionMatrix(false);
  }, []);

  useEffect(() => {
    if (initialData) {
      const permsObj: Record<string, boolean> = {};

      if (Array.isArray(initialData.permissionKeys)) {
        initialData.permissionKeys.forEach((key: string) => {
          permsObj[key] = true;
        });
      } else if (Array.isArray(initialData.permissions)) {
        initialData.permissions.forEach((key: string) => {
          permsObj[key] = true;
        });
      } else if (initialData.permissions && typeof initialData.permissions === 'object') {
        Object.entries(initialData.permissions).forEach(([k, v]) => {
          permsObj[k] = Boolean(v);
        });
      }

      setFormData({
        name: initialData.name || initialData.ad || '',
        description: initialData.description || initialData.aciklama || '',
        permissions: permsObj
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: {}
      });
      setErrors({});
    }
  }, [initialData]);

  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(formData.name !== (initialData?.name || initialData?.ad || ''));
    }
  }, [formData.name, initialData, onDirtyChange]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors = validateRolForm(formData, t);
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setIsSaving(true);
    try {
      const activePermissionKeys = Object.keys(formData.permissions).filter(
        (key) => !!formData.permissions[key]
      );

      const dataToSave = {
        id: initialData?.id,
        name: formData.name.trim(),
        description: formData.description?.trim(),
        permissionKeys: activePermissionKeys
      };

      await adapter.saveRole(dataToSave);
      toast.success(t('rol_kaydedildi_mesaj', 'Rol başarıyla kaydedildi.'));
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.mesaj || err?.message || t('rol_kaydedilemedi_mesaj', 'Kaydedilemedi.');
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePermissionToggle = (permKey: string) => {
    if (initialData?.isSystemRole) return;
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permKey]: !prev.permissions[permKey]
      }
    }));
  };

  const handleModuleToggleAll = (moduleGroup: IModulePermissionMatrixGroup, checked: boolean) => {
    if (initialData?.isSystemRole) return;
    setFormData((prev) => {
      const newPerms = { ...prev.permissions };
      moduleGroup.entities.forEach((entity) => {
        entity.actions.forEach((act) => {
          newPerms[act.key] = checked;
        });
      });
      return { ...prev, permissions: newPerms };
    });
  };

  const handleEntityToggleAll = (entity: IModulePermissionMatrixGroup['entities'][0], checked: boolean) => {
    if (initialData?.isSystemRole) return;
    setFormData((prev) => {
      const newPerms = { ...prev.permissions };
      entity.actions.forEach((act) => {
        newPerms[act.key] = checked;
      });
      return { ...prev, permissions: newPerms };
    });
  };

  const isEntityFullyChecked = (entity: IModulePermissionMatrixGroup['entities'][0]) => {
    if (!entity.actions || entity.actions.length === 0) return false;
    return entity.actions.every((act) => !!formData.permissions[act.key]);
  };

  const isEntityPartiallyChecked = (entity: IModulePermissionMatrixGroup['entities'][0]) => {
    const checkedCount = entity.actions.filter((act) => !!formData.permissions[act.key]).length;
    return checkedCount > 0 && checkedCount < entity.actions.length;
  };

  const isModuleFullyChecked = (moduleGroup: IModulePermissionMatrixGroup) => {
    if (!moduleGroup.entities || moduleGroup.entities.length === 0) return false;
    return moduleGroup.entities.every((entity) => isEntityFullyChecked(entity));
  };

  const isModulePartiallyChecked = (moduleGroup: IModulePermissionMatrixGroup) => {
    let checkedCount = 0;
    let totalCount = 0;
    moduleGroup.entities.forEach((entity) => {
      totalCount += entity.actions.length;
      entity.actions.forEach((act) => {
        if (formData.permissions[act.key]) checkedCount++;
      });
    });
    return checkedCount > 0 && checkedCount < totalCount;
  };

  return (
    <form onSubmit={handleSave} className="role-form-container">
      {initialData?.isSystemRole && (
        <div className="role-form-system-banner">
          <AlertCircle size={20} className="access-denied-icon" />
          <div>
            <h4 className="role-card-title">{t('auto_sistem_rolu_6432', 'Sistem Rolü')}</h4>
            <p className="access-denied-desc">{t('auto_bu_bir_varsayilan_si_eb69', 'Bu bir varsayılan sistem rolüdür. Güvenlik gerekçesiyle yetkileri düzenlenemez.')}</p>
          </div>
        </div>
      )}

      <div className="role-form-scrollable">
        {/* Role Basic Info */}
        <div className="role-form-info-section">
          <div className="form-group mb-16">
            <label className="form-label">{t('auto_rol_adi__75bc', 'Rol Adı')}</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: '' }));
                }
              }}
              onBlur={() => {
                const err = validateRolField('name', formData.name, t);
                if (err) setErrors((prev) => ({ ...prev, name: err }));
              }}
              disabled={initialData?.isSystemRole || isSaving}
              placeholder={t('rol_adi_ornek', 'Örn: Finans Uzmanı, Depo Görevlisi')}
            />
            <FieldError error={errors.name} />
          </div>

          <div className="form-group mb-0">
            <label className="form-label">{t('auto_aciklama_1bab', 'Açıklama')}</label>
            <textarea
              className="form-control"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={initialData?.isSystemRole || isSaving}
              placeholder={t('rol_aciklama_ornek', 'Bu rolün sistemdeki yetki kapsamını ve sorumluluklarını açıklayın...')}
              rows={2}
            />
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="role-form-matrix-section">
          <div className="role-form-matrix-header">
            <h3 className="role-form-matrix-title">{t('yetki_matrisi_baslik', 'Yetki Matrisi (Modüler İzinler)')}</h3>
            <span className="permission-module-prefix-tag">
              {matrix.reduce((acc, m) => acc + m.entities.reduce((eAcc, e) => eAcc + e.actions.length, 0), 0)}{' '}
              {t('toplam_izin_anahtari', 'Toplam Yetki Tanımı')}
            </span>
          </div>

          {matrix.map((moduleGroup) => (
            <div key={moduleGroup.moduleId} className="permission-module-group">
              <div className="permission-module-header">
                <div className="permission-module-title-box">
                  <h4 className="permission-module-title">{t(moduleGroup.moduleTitle, moduleGroup.moduleTitle)}</h4>
                  <span className="permission-module-prefix-tag">{moduleGroup.permissionPrefix}</span>
                </div>

                <button
                  type="button"
                  disabled={initialData?.isSystemRole}
                  onClick={() => handleModuleToggleAll(moduleGroup, !isModuleFullyChecked(moduleGroup))}
                  className={`permission-toggle-all-btn ${isModuleFullyChecked(moduleGroup) ? 'is-active' : ''}`}
                >
                  {isModuleFullyChecked(moduleGroup) ? (
                    <CheckSquare size={16} />
                  ) : isModulePartiallyChecked(moduleGroup) ? (
                    <div className="custom-partial-checkbox" />
                  ) : (
                    <Square size={16} />
                  )}
                  <span>{t('tumunu_sec', 'Tümünü Seç')}</span>
                </button>
              </div>

              <div className="flex-col gap-8">
                {moduleGroup.entities.map((entity) => {
                  const isChecked = isEntityFullyChecked(entity);
                  const isPartial = isEntityPartiallyChecked(entity);

                  return (
                    <div key={entity.id} className="permission-entity-row">
                      <div className="permission-entity-title-box">
                        <button
                          type="button"
                          disabled={initialData?.isSystemRole}
                          onClick={() => handleEntityToggleAll(entity, !isChecked)}
                          className={`permission-entity-toggle-btn ${isChecked ? 'is-active' : ''}`}
                        >
                          {isChecked ? (
                            <CheckSquare size={18} />
                          ) : isPartial ? (
                            <div className="custom-partial-checkbox" />
                          ) : (
                            <Square size={18} />
                          )}
                        </button>

                        <div className="flex-col gap-4">
                          <span className="permission-entity-name">{t(entity.titleKey, entity.titleKey)}</span>
                          <span className={`permission-category-pill ${entity.category}`}>
                            {t(`kategori_${entity.category}`, entity.category.toUpperCase())}
                          </span>
                        </div>
                      </div>

                      <div className="permission-actions-box">
                        {entity.actions.map((act) => {
                          const isActChecked = !!formData.permissions[act.key];

                          return (
                            <button
                              type="button"
                              key={act.key}
                              disabled={initialData?.isSystemRole}
                              onClick={() => handlePermissionToggle(act.key)}
                              title={`${act.key}${act.description ? ` (${act.description})` : ''}`}
                              className={`permission-action-pill ${
                                isActChecked ? `is-active ${act.danger ? 'is-danger' : ''}` : 'is-inactive'
                              }`}
                            >
                              {isActChecked && <Check size={13} strokeWidth={3} />}
                              <span>{t(act.labelKey, act.action)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="role-form-footer">
        {initialData && !initialData.isSystemRole && (
          <button
            type="button"
            className="btn btn-secondary mr-auto"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                name: `${prev.name} (${t('kopya', 'Kopya')})`
              }));
              toast.success(t('rol_kopyalandi', 'Rol kopyalandı. Yeni adıyla kaydedebilirsiniz.'));
            }}
          >
            <Copy size={16} />
            <span>{t('kopyala', 'Kopyala')}</span>
          </button>
        )}

        <button type="button" onClick={onCancel} className="btn btn-secondary">
          {t('iptal', 'İptal')}
        </button>

        {!initialData?.isSystemRole && (
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            <Save size={18} />
            <span>{isSaving ? t('auto_yukleniyor_4deb', 'Yükleniyor...') : t('kaydet', 'Kaydet')}</span>
          </button>
        )}
      </div>
    </form>
  );
};

export default RolForm;

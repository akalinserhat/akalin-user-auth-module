/**
 * @akalin/user_auth_module - Rol ve Yetki Yönetimi Sayfası (RolVeYetkilerPage.tsx)
 * Sistem rollerini, izinlerini ve personel atamalarını yöneten kart listesi sayfası.
 */

import React from 'react';
import { Shield, Users, Edit2, Trash2 } from 'lucide-react';
import { BaseModalCrud } from '@akalin/ui';
import RolForm from '../components/RolForm';
import { useTranslation } from 'react-i18next';
import { useUserAuthModule } from '../adapters/UserAuthServiceContext';
import { RoleDTO } from '../types';

export const RolVeYetkilerPage: React.FC = () => {
  const { t } = useTranslation();
  const { adapter } = useUserAuthModule();

  const customRenderContent = ({ data, loading, handleEdit, handleDelete }: any) => {
    if (loading) {
      return (
        <div className="empty-state-container">
          <p className="empty-state-text">{t('auto_yukleniyor_4deb', 'Yükleniyor...')}</p>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="empty-state-box">
          <Shield size={48} className="empty-state-icon" />
          <p className="empty-state-text">{t('auto_rol_bulunamadi_32bf', 'Kayıtlı rol bulunamadı.')}</p>
        </div>
      );
    }

    return (
      <div className="role-cards-grid">
        {data.map((role: RoleDTO) => (
          <div key={role.id} className="role-card">
            <div className="role-card-header">
              <div className="role-card-title-group">
                <div className="role-card-icon-box">
                  <Shield size={20} className="role-card-icon" />
                </div>
                <div>
                  <h4 className="role-card-title">{role.name || role.ad}</h4>
                  {role.isSystemRole && (
                    <span className="role-system-tag">{t('auto_sistem_rolu_bd70', 'Sistem Rolü')}</span>
                  )}
                </div>
              </div>
            </div>

            <p className="role-card-desc">
              {role.description || role.aciklama || t('aciklama_belirtilmemis', 'Açıklama belirtilmemiş.')}
            </p>

            <div className="role-card-user-info">
              <Users size={16} className="text-secondary" />
              <span className="role-card-user-count">
                {role.userCount || 0} {t('personel', 'Personel')}
              </span>
              <span className="text-secondary">{t('auto_bu_role_atanmis_81ed', 'bu role atanmış')}</span>
            </div>

            <div className="role-card-actions-bar">
              <button
                type="button"
                onClick={() => handleEdit(role)}
                className="role-card-edit-btn"
              >
                <Edit2 size={16} />
                <span>{t('yetkileri_duzenle', 'Yetkileri Düzenle')}</span>
              </button>

              {!role.isSystemRole && handleDelete && (
                <button
                  type="button"
                  onClick={() => handleDelete(role)}
                  className="role-card-delete-btn"
                  title={t('sil', 'Sil')}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <BaseModalCrud
      icon={<Shield size={24} />}
      title={t('rol_ve_yetki_yonetimi', 'Rol ve Yetki Yönetimi')}
      subtitle={t('rol_ve_yetki_aciklama', 'Sistem rollerini yönetin ve yetkilendirmeleri düzenleyin.')}
      itemNameResolver={(item: any) => item.name || item.ad}
      formComponent={RolForm as any}
      modalTitlePrefix={t('rol', 'Rol')}
      modalSize="xl"
      customRenderContent={customRenderContent}
      customFetchData={async () => {
        const data = await adapter.getRoles();
        return { data };
      }}
      customDeleteData={async (id: any) => {
        await adapter.deleteRole(Number(id));
      }}
      canDelete={async (item: any) => {
        if (adapter.canDeleteRole) {
          return await adapter.canDeleteRole(item.id);
        }
        return true;
      }}
      searchableFields={[{ field: 'name', type: 'String' }]}
    />
  );
};

export default RolVeYetkilerPage;

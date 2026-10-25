/**
 * @akalin/user_auth_module - Sistem Yöneticileri (Süper Admin) Listesi (SuperAdminListPage.tsx)
 * BaseListPage mimarisi üzerine inşa edilmiş, platformun süper adminlerini
 * listeleyen, arayan, filtreleyen, ekleyen, düzenleyen ve silen sayfa.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Edit2, 
  Trash2, 
  Mail, 
  ShieldCheck, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { 
  BaseListPage, 
  ActionMenu, 
  SaveButton, 
  CancelButton, 
  useAlertDialog,
  EkleFloatCircleButton
} from '@akalin/ui';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useUserAuthModule } from '../adapters/UserAuthServiceContext';
import { validateSuperAdminForm } from '../validators/superAdminValidation';
import { SuperAdminDTO } from '../types';

export default function SuperAdminListPage() {
  const { t } = useTranslation();
  const { adapter, setSearchPlaceholder } = useUserAuthModule();
  const { showAlert } = useAlertDialog();
  
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<SuperAdminDTO | null>(null);
  const [formData, setFormData] = useState({ 
    ad: '', 
    soyad: '', 
    email: '', 
    sifre: '', 
    aktifMi: true 
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (setSearchPlaceholder) {
      setSearchPlaceholder(t('yonetici_ara_placeholder', 'İsim veya E-posta ara...'));
    }
    return () => {
      if (setSearchPlaceholder) {
        setSearchPlaceholder(t('arama_yapin', 'Arama yapın...'));
      }
    };
  }, [setSearchPlaceholder, t]);

  const customFetchData = useCallback(async (paramsObj: any = {}) => {
    try {
      const data = await adapter.getSuperAdmins();
      let list = Array.isArray(data) ? data : [];

      const queryTerm = (paramsObj.aramaData?.value || '').toLocaleLowerCase('tr-TR').trim();
      const type = paramsObj.aramaData?.type || 'Tumu';

      if (queryTerm) {
        list = list.filter((user: any) => {
          if (type === 'AdSoyad') {
            return user.adSoyad?.toLocaleLowerCase('tr-TR').includes(queryTerm);
          }
          if (type === 'Email') {
            return user.email?.toLocaleLowerCase('tr-TR').includes(queryTerm);
          }
          return (
            user.adSoyad?.toLocaleLowerCase('tr-TR').includes(queryTerm) ||
            user.email?.toLocaleLowerCase('tr-TR').includes(queryTerm) ||
            user.rol?.toLocaleLowerCase('tr-TR').includes(queryTerm)
          );
        });
      }

      return { data: list, totalCount: list.length };
    } catch (err: any) {
      console.error('Kullanıcılar getirilirken hata:', err);
      toast.error(t('yoneticiler_yuklenirken_hata', 'Yöneticiler yüklenirken hata oluştu.'));
      return { data: [], totalCount: 0 };
    }
  }, [adapter, t]);

  const handleOpenModal = useCallback((user: SuperAdminDTO | null = null) => {
    setError('');
    if (user) {
      setEditingUser(user);
      const parts = (user.adSoyad || '').split(' ');
      const soyad = parts.pop() || '';
      const ad = parts.join(' ') || '';
      
      setFormData({
        ad: user.ad || ad,
        soyad: user.soyad || soyad,
        email: user.email || '',
        sifre: '',
        aktifMi: user.durum === 'Aktif' || user.aktifMi === true
      });
    } else {
      setEditingUser(null);
      setFormData({ 
        ad: '', 
        soyad: '', 
        email: '', 
        sifre: '', 
        aktifMi: true 
      });
    }
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingUser(null);
    setError('');
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const valErrors = validateSuperAdminForm(formData, !!editingUser, t);
    if (Object.keys(valErrors).length > 0) {
      setError(Object.values(valErrors)[0]);
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (editingUser) {
        await adapter.updateSuperAdmin(editingUser.id, formData);
        toast.success(t('yonetici_kaydedildi', 'Yönetici başarıyla kaydedildi.'));
      } else {
        await adapter.createSuperAdmin(formData);
        toast.success(t('yonetici_kaydedildi', 'Yönetici başarıyla kaydedildi.'));
      }
      handleCloseModal();
      setRefreshKey((prev) => prev + 1);
    } catch (err: any) {
      setError(err.response?.data?.mesaj || err.message || t('kayit_sirasinda_hata_olustu', 'Kayıt sırasında bir hata oluştu.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = useCallback((user: any) => {
    const id = user.id;
    const adSoyad = user.adSoyad;
    showAlert(
      'confirm',
      t('yonetici_sil_baslik', 'Yöneticiyi Sil'),
      t('yonetici_sil_onay', '"{{adSoyad}}" isimli yöneticiyi silmek istediğinize emin misiniz?', { adSoyad }),
      async () => {
        try {
          await adapter.deleteSuperAdmin(id);
          setRefreshKey((prev) => prev + 1);
          toast.success(t('yonetici_silindi', 'Yönetici başarıyla silindi.'));
        } catch (err: any) {
          showAlert('error', t('hata', 'Hata'), err.response?.data?.mesaj || err.message || t('silme_islemi_sirasinda_hata', 'Silme işlemi sırasında hata oluştu.'));
        }
      },
      t('evet_sil', 'Evet, Sil'),
      t('iptal', 'İptal')
    );
  }, [showAlert, adapter, t]);

  const searchableFields = useMemo(() => [
    { id: 'Tumu', label: t('tumu', 'Tümü'), type: 'text', placeholder: t('isim_veya_eposta_ara', 'İsim veya e-posta ara...') },
    { id: 'AdSoyad', label: t('ad_soyad', 'Ad Soyad'), type: 'text', placeholder: t('ad_soyad_girin', 'Ad soyad girin...') },
    { id: 'Email', label: t('eposta', 'E-Posta'), type: 'text', placeholder: t('eposta_girin', 'E-posta girin...') }
  ], [t]);

  const columns = useMemo(() => [
    {
      id: 'kullanici',
      header: t('kullanici', 'Kullanıcı'),
      accessor: 'adSoyad',
      sortable: true,
      minWidth: 260,
      render: (user: any) => {
        const initial = (user.adSoyad || 'A').trim().charAt(0).toUpperCase();
        return (
          <div className="kullanici-col-cell">
            <div className="kullanici-avatar-box">
              {initial}
            </div>
            <div>
              <div className="kullanici-info-title">
                {user.adSoyad || t('isimsiz_yonetici', 'İsimsiz Yönetici')}
              </div>
              <div className="kullanici-info-meta">
                <span className="inline-flex items-center gap-4">
                  <Mail size={12} />
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      id: 'rol',
      header: t('rol', 'Rol'),
      accessor: 'rol',
      sortable: true,
      width: '180px',
      align: 'center' as const,
      render: (user: any) => (
        <div className="kullanici-badge-superadmin">
          <ShieldCheck size={14} />
          <span>{user.rol || t('super_admin', 'Süper Admin')}</span>
        </div>
      )
    },
    {
      id: 'durum',
      header: t('durum', 'Durum'),
      accessor: 'durum',
      sortable: true,
      width: '140px',
      align: 'center' as const,
      render: (user: any) => {
        const isAktif = user.durum === 'Aktif' || user.aktifMi === true;
        return (
          <div className="kullanici-durum-cell">
            <div className={`kullanici-durum-dot ${isAktif ? 'aktif' : 'pasif'}`} />
            <span className="text-13 font-500 text-primary">
              {isAktif ? t('aktif', 'Aktif') : t('pasif', 'Pasif')}
            </span>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: '',
      width: '60px',
      align: 'center' as const,
      render: (user: any, _index: number, tableActions: any) => (
        <ActionMenu
          actions={[
            {
              label: t('duzenle', 'Düzenle'),
              icon: <Edit2 size={16} />,
              onClick: (e: any) => tableActions?.handleEdit ? tableActions.handleEdit(user, e) : handleOpenModal(user)
            },
            {
              label: t('sil', 'Sil'),
              icon: <Trash2 size={16} />,
              onClick: () => tableActions?.handleDelete ? tableActions.handleDelete(user) : handleDelete(user),
              danger: true
            }
          ]}
        />
      )
    }
  ], [t, handleOpenModal, handleDelete]);

  const mobileCardRender = useCallback((user: any) => {
    const isAktif = user.durum === 'Aktif' || user.aktifMi === true;
    const initial = (user.adSoyad || 'A').trim().charAt(0).toUpperCase();

    return (
      <div className="flex-col gap-12 p-16">
        <div className="flex-row items-center justify-between">
          <div className="flex-row items-center gap-12">
            <div className="kullanici-avatar-box">
              {initial}
            </div>
            <div className="flex-col">
              <div className="kullanici-info-title">{user.adSoyad || t('isimsiz_yonetici', 'İsimsiz Yönetici')}</div>
              <div className="kullanici-info-meta">
                <span className="inline-flex items-center gap-4">
                  <Mail size={12} /> {user.email}
                </span>
              </div>
            </div>
          </div>
          <div className="kullanici-durum-cell">
            <div className={`kullanici-durum-dot ${isAktif ? 'aktif' : 'pasif'}`} />
            <span className="text-12 font-500">{isAktif ? t('aktif', 'Aktif') : t('pasif', 'Pasif')}</span>
          </div>
        </div>

        <div className="flex-row items-center justify-between pt-8 border-t border-glass">
          <div className="kullanici-badge-superadmin">
            <ShieldCheck size={13} />
            <span>{user.rol || t('super_admin', 'Süper Admin')}</span>
          </div>
        </div>
      </div>
    );
  }, [t]);

  return (
    <>
      <BaseListPage
        title={t('sistem_yoneticileri', 'Sistem Yöneticileri')}
        subtitle={t('sistem_yoneticileri_aciklama', 'Webakus ERP sistemini yöneten süper admin hesapları.')}
        icon={<ShieldCheck size={24} />}
        baseRoute="/kullanicilar"
        customFetchData={customFetchData}
        columns={columns}
        searchableFields={searchableFields}
        addNewText={t('yeni_yonetici_ekle', 'Yeni Yönetici Ekle')}
        onAddNew={() => handleOpenModal()}
        customAddButton={
          <EkleFloatCircleButton
            onClick={() => handleOpenModal()}
            title={t('yeni_yonetici_ekle', 'Yeni Yönetici Ekle')}
            position="fixed-bottom-right"
            useShadow={true}
          />
        }
        onEdit={(user) => handleOpenModal(user)}
        customDeleteData={(id) => adapter.deleteSuperAdmin(id)}
        emptyMessage={t('yonetici_bulunamadi', 'Yönetici bulunamadı.')}
        mobileCardRender={mobileCardRender}
        enableColumnManagement={true}
        refreshKey={refreshKey}
      />

      {/* YÖNETİCİ EKLE / DÜZENLE MODALI */}
      {showModal && (
        <div className="admin-modal-backdrop" onClick={handleCloseModal}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingUser ? t('yonetici_duzenle', 'Yönetici Düzenle') : t('yeni_yonetici_ekle', 'Yeni Yönetici Ekle')}</h2>
              <button type="button" onClick={handleCloseModal} className="btn-icon" title={t('kapat', 'Kapat')}>
                <X size={20} />
              </button>
            </div>
            
            <div className="admin-modal-body">
              {error && (
                <div className="admin-modal-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form id="adminForm" onSubmit={handleSave} className="flex-col gap-16">
                <div className="admin-modal-row">
                  <div className="admin-modal-col">
                    <label className="admin-modal-label">{t('ad', 'Ad')}</label>
                    <input 
                      type="text" 
                      required
                      className="admin-modal-input"
                      value={formData.ad} 
                      onChange={e => setFormData({ ...formData, ad: e.target.value })}
                      placeholder={t('ad', 'Ad')}
                    />
                  </div>
                  <div className="admin-modal-col">
                    <label className="admin-modal-label">{t('soyad', 'Soyad')}</label>
                    <input 
                      type="text" 
                      required
                      className="admin-modal-input"
                      value={formData.soyad} 
                      onChange={e => setFormData({ ...formData, soyad: e.target.value })}
                      placeholder={t('soyad', 'Soyad')}
                    />
                  </div>
                </div>

                <div className="flex-col gap-6">
                  <label className="admin-modal-label">{t('eposta', 'E-Posta')}</label>
                  <input 
                    type="email" 
                    required
                    className="admin-modal-input"
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('ornek_admin_eposta', 'admin@example.com')}
                  />
                </div>

                <div className="flex-col gap-6">
                  <label className="admin-modal-label">
                    {t('sifre', 'Şifre')}
                    {editingUser && (
                      <span className="text-secondary text-xs ml-6">
                        ({t('sifre_degistirme_ipucu', 'Değiştirmek istemiyorsanız boş bırakın')})
                      </span>
                    )}
                  </label>
                  <input 
                    type="password" 
                    required={!editingUser}
                    className="admin-modal-input"
                    value={formData.sifre} 
                    onChange={e => setFormData({ ...formData, sifre: e.target.value })}
                    placeholder={editingUser ? "••••••••" : t('yeni_sifre', 'Yeni Şifre')}
                  />
                </div>

                {editingUser && (
                  <label className="admin-modal-checkbox-row">
                    <input 
                      type="checkbox" 
                      id="aktifMi"
                      className="admin-modal-checkbox"
                      checked={formData.aktifMi}
                      onChange={e => setFormData({ ...formData, aktifMi: e.target.checked })}
                    />
                    <span className="text-primary text-sm font-medium">
                      {t('hesap_aktif_aciklama', 'Hesap Aktif (Giriş Yapabilir)')}
                    </span>
                  </label>
                )}
              </form>
            </div>
            
            <div className="admin-modal-footer">
              <CancelButton onClick={handleCloseModal} text={t('iptal', 'İptal')} />
              <SaveButton form="adminForm" isSaving={saving} text={t('kaydet', 'Kaydet')} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

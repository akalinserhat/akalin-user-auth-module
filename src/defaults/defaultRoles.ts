/**
 * @akalin/user_auth_module - Varsayılan ve Örnek Veriler (defaultRoles.ts)
 */

import { SuperAdminDTO, RoleDTO, UserAuthUserDTO } from '../types';

export const DEFAULT_SAMPLE_SUPER_ADMINS: SuperAdminDTO[] = [
  {
    id: 1,
    ad: 'Admin',
    soyad: 'Webakus',
    adSoyad: 'Admin Webakus',
    email: 'admin@akalinsoftware.com',
    rol: 'Süper Admin',
    durum: 'Aktif',
    aktifMi: true
  },
  {
    id: 2,
    ad: 'Serhat',
    soyad: 'Akalın',
    adSoyad: 'Serhat Akalın',
    email: 'akalinserhat@gmail.com',
    rol: 'Süper Admin',
    durum: 'Aktif',
    aktifMi: true
  }
];

export const DEFAULT_SAMPLE_ROLES: RoleDTO[] = [
  {
    id: 1,
    name: 'Yönetici (Admin)',
    description: 'Sistemdeki tüm modüllere ve ayarlara tam erişim yetkisi.',
    isSystemRole: true,
    userCount: 2,
    permissionKeys: ['*']
  },
  {
    id: 2,
    name: 'Muhasebe & Finans',
    description: 'Fatura, irsaliye, kasa, banka ve cari hesap işlemleri yetkisi.',
    isSystemRole: false,
    userCount: 4,
    permissionKeys: ['fatura.*', 'irsaliye.*', 'kasa.*', 'banka.*', 'cari.*']
  },
  {
    id: 3,
    name: 'Depo & Sevkiyat',
    description: 'Stok takibi, depo transferleri, sayım ve barkod terminali yetkisi.',
    isSystemRole: false,
    userCount: 3,
    permissionKeys: ['depo.*', 'stok.*', 'barkod.*']
  },
  {
    id: 4,
    name: 'Standart Kullanıcı',
    description: 'Temel görüntüleme ve veri girişi yetkisi.',
    isSystemRole: false,
    userCount: 6,
    permissionKeys: ['cari.view', 'urun.view']
  }
];

export const DEFAULT_SAMPLE_PERSONNEL: UserAuthUserDTO[] = [
  {
    id: 1,
    ad: 'Ahmet',
    soyad: 'Kaya',
    adSoyad: 'Ahmet Kaya',
    email: 'ahmet@firma.com',
    telefon: '0532 111 22 33',
    rolId: 1,
    rolAdi: 'Yönetici (Admin)',
    aktifMi: true,
    durum: 'Aktif'
  },
  {
    id: 2,
    ad: 'Elif',
    soyad: 'Demir',
    adSoyad: 'Elif Demir',
    email: 'elif@firma.com',
    telefon: '0542 333 44 55',
    rolId: 2,
    rolAdi: 'Muhasebe & Finans',
    aktifMi: true,
    durum: 'Aktif'
  }
];

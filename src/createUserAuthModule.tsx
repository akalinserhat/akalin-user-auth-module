/**
 * @akalin/user_auth_module - Modül Tanım Fabrikası (createUserAuthModule.tsx)
 * @akalin/module_core (IModuleDefinition) ile tam uyumlu Kullanıcı ve Yetki Yönetimi Modülü üretir.
 */

import React, { lazy } from 'react';
import { Users, Shield, UserCog } from 'lucide-react';
import type { IModuleDefinition } from '@akalin/module_core';
import { CreateUserAuthModuleOptions } from './types';
import {
  createRestUserAuthAdapter,
  setGlobalUserAuthModuleConfig,
  UserAuthModuleProvider
} from './adapters/UserAuthServiceContext';

const SuperAdminListPage = lazy(() => import('./pages/SuperAdminListPage'));
const RolVeYetkilerPage = lazy(() => import('./pages/RolVeYetkilerPage'));

export function createUserAuthModule(options: CreateUserAuthModuleOptions = {}): IModuleDefinition {
  const adapter = options.adapter || createRestUserAuthAdapter();

  setGlobalUserAuthModuleConfig({
    adapter,
    onNotify: options.onNotify
  });

  const baseRoute = (options.baseRoute || '/kullanicilar').replace(/\/$/, '');
  const rolesRoute = (options.rolesRoute || '/roller').replace(/\/$/, '');
  const superAdminRoute = (options.superAdminRoute || '/super-adminler').replace(/\/$/, '');

  const ConnectedSuperAdminListPage: React.FC<any> = (props) => (
    <UserAuthModuleProvider value={{ adapter, onNotify: options.onNotify }}>
      <SuperAdminListPage {...props} />
    </UserAuthModuleProvider>
  );

  const ConnectedRolVeYetkilerPage: React.FC<any> = (props) => (
    <UserAuthModuleProvider value={{ adapter, onNotify: options.onNotify }}>
      <RolVeYetkilerPage {...props} />
    </UserAuthModuleProvider>
  );

  return {
    id: options.id || 'kullanici_ve_yetki',
    title: 'Kullanıcı & Yetki Yönetimi',
    name: 'Kullanıcı & Yetki Yönetimi',
    description: 'Sistem süper yöneticileri, roller, izin matrisi ve personel yetkilendirmesi.',
    icon: React.createElement(Users, { size: 20 }),
    iconName: 'UserCog',
    order: options.order ?? 40,
    permissionPrefix: 'auth',
    routes: [
      {
        path: baseRoute,
        element: React.createElement(ConnectedSuperAdminListPage),
        title: 'Kullanıcı Yönetimi'
      },
      {
        path: superAdminRoute,
        element: React.createElement(ConnectedSuperAdminListPage),
        title: 'Sistem Yöneticileri'
      },
      {
        path: rolesRoute,
        element: React.createElement(ConnectedRolVeYetkilerPage),
        title: 'Rol ve Yetkiler'
      },
      {
        path: '/ayarlar/RolVeYetkiler',
        element: React.createElement(ConnectedRolVeYetkilerPage),
        title: 'Rol ve Yetki Yönetimi'
      }
    ],
    menuItems: [
      {
        id: 'menu_kullanicilar',
        label: 'Kullanıcı Yönetimi',
        path: baseRoute,
        icon: React.createElement(Users, { size: 20 }),
        order: options.order ?? 40
      },
      {
        id: 'menu_roller',
        label: 'Rol ve Yetkiler',
        path: rolesRoute,
        icon: React.createElement(Shield, { size: 20 }),
        order: (options.order ?? 40) + 1
      }
    ],
    settingsModules: [
      {
        id: 'RolVeYetkiler',
        name: 'Rol ve Yetki Yönetimi',
        desc: 'Sistem rollerini ve dinamik yetki matrisini yapılandırın.',
        icon: React.createElement(Shield, { size: 28 }),
        order: 40,
        hasOwnLayout: true,
        component: ConnectedRolVeYetkilerPage
      }
    ],
    cards: [
      {
        id: 'super_adminler',
        category: 'kart',
        titleKey: 'Sistem Yöneticileri',
        route: baseRoute
      },
      {
        id: 'roller',
        category: 'kart',
        titleKey: 'Rol ve Yetki Tanımları',
        route: rolesRoute
      }
    ],
    permissions: [
      {
        key: 'auth.user_view',
        name: 'Yöneticileri Görüntüleme',
        description: 'Süper admin ve kullanıcı listesini görüntüleme yetkisi.',
        group: 'Kullanıcı & Yetki'
      },
      {
        key: 'auth.user_manage',
        name: 'Yönetici Yönetimi',
        description: 'Süper admin ekleme, düzenleme ve silme yetkisi.',
        group: 'Kullanıcı & Yetki'
      },
      {
        key: 'auth.role_view',
        name: 'Rolleri Görüntüleme',
        description: 'Sistem rollerini listeleme yetkisi.',
        group: 'Kullanıcı & Yetki'
      },
      {
        key: 'auth.role_manage',
        name: 'Rol ve İzin Yönetimi',
        description: 'Rol oluşturma, düzenleme ve modül izin matrisini yapılandırma yetkisi.',
        group: 'Kullanıcı & Yetki'
      }
    ],
    components: {
      SuperAdminListPage: ConnectedSuperAdminListPage,
      RolVeYetkilerPage: ConnectedRolVeYetkilerPage
    }
  };
}

export const KullaniciVeYetkiModule = createUserAuthModule();
export default createUserAuthModule;

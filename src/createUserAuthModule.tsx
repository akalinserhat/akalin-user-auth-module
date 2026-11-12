/**
 * @akalin/user_auth_module - Modül Tanım Fabrikası (createUserAuthModule.tsx)
 * @akalin/module_core (IModuleDefinition) ve @akalin/module_management ile %100 uyumlu
 * Kullanıcı & Yetki Yönetimi Modülü (KullaniciVeYetkiModule) ve Merkezi Kimlik Doğrulama
 * Modülü (AuthModule) üretir.
 */

import React, { lazy } from 'react';
import { Lock, Shield, Users } from 'lucide-react';
import type { IModuleDefinition, IRouteDefinition } from '@akalin/module_core';
import { CreateAuthModuleOptions, CreateUserAuthModuleOptions } from './types';
import {
  createRestUserAuthAdapter,
  setGlobalUserAuthModuleConfig,
  UserAuthModuleProvider
} from './adapters/UserAuthServiceContext';
import UserAuthLoginPage from './pages/LoginPage';

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

  const ConnectedLoginPage: React.FC<any> = (props) => (
    <UserAuthModuleProvider value={{ adapter, onNotify: options.onNotify }}>
      <UserAuthLoginPage {...(options.loginPageProps || {})} {...props} />
    </UserAuthModuleProvider>
  );

  const routes: IRouteDefinition[] = [
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
  ];

  if (options.loginRoute) {
    routes.unshift({
      path: options.loginRoute,
      element: React.createElement(ConnectedLoginPage),
      title: 'Sisteme Giriş',
      isPublic: true
    });
  }

  return {
    id: options.id || 'kullanici_ve_yetki',
    aliases: ['auth', 'user_auth', 'kullanici_yetki'],
    title: 'Kullanıcı & Yetki Yönetimi',
    name: 'Kullanıcı & Yetki Yönetimi',
    description:
      'Merkezi kimlik doğrulama (Login), sistem süper yöneticileri, roller, izin matrisi ve personel yetkilendirmesi.',
    icon: React.createElement(Users, { size: 20 }),
    iconName: 'Users',
    order: options.order ?? 40,
    isCore: options.isCore ?? true,
    defaultActive: true,
    permissionPrefix: 'auth',
    routes,
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
      RolVeYetkilerPage: ConnectedRolVeYetkilerPage,
      LoginPage: ConnectedLoginPage,
      UserAuthLoginPage: ConnectedLoginPage
    }
  };
}

/**
 * @akalin/module_management ve modules.json ('exportName': 'AuthModule') ile
 * tam uyumlu çekirdek Kimlik Doğrulama (Login) modülü fabrikası.
 */
export function createAuthModule(options: CreateAuthModuleOptions = {}): IModuleDefinition {
  const loginRoute = options.loginRoute || '/login';
  const title = options.title || 'Kimlik Doğrulama';

  const ResolvedLoginComponent: React.ComponentType<any> = options.loginPageComponent
    ? options.loginPageComponent
    : (props: any) => <UserAuthLoginPage {...(options.loginPageProps || {})} {...props} />;

  return {
    id: options.id || 'auth',
    aliases: ['authentication', 'login'],
    title,
    name: title,
    description: 'Merkezi kullanıcı kimlik doğrulama, oturum yönetimi ve güvenli giriş modülü.',
    icon: React.createElement(Lock, { size: 20 }),
    iconName: 'Lock',
    order: options.order ?? 99,
    isCore: options.isCore ?? true,
    defaultActive: true,
    permissionPrefix: 'auth',
    routes: [
      {
        path: loginRoute,
        element: React.createElement(ResolvedLoginComponent),
        title,
        isPublic: true
      }
    ],
    menuItems: [],
    components: {
      LoginPage: ResolvedLoginComponent,
      UserAuthLoginPage: ResolvedLoginComponent
    }
  };
}

export const KullaniciVeYetkiModule = createUserAuthModule();
export const AuthModule = createAuthModule();
export default createUserAuthModule;

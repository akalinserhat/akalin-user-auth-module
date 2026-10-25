/**
 * @akalin/user_auth_module - Adapter ve Context Katmanı (UserAuthServiceContext.tsx)
 * Kullanıcı, rol ve yetki servis çağrılarını soyutlar.
 */

import React, { createContext, useContext } from 'react';
import axios from 'axios';
import {
  IUserAuthServiceAdapter,
  SuperAdminDTO,
  RoleDTO,
  UserAuthUserDTO,
  CreateUserAuthModuleOptions
} from '../types';
import {
  DEFAULT_SAMPLE_SUPER_ADMINS,
  DEFAULT_SAMPLE_ROLES,
  DEFAULT_SAMPLE_PERSONNEL
} from '../defaults/defaultRoles';

/**
 * REST API çağrıları için varsayılan HTTP istemcisi adapter'ı.
 */
export function createRestUserAuthAdapter(client: any = axios): IUserAuthServiceAdapter {
  return {
    async getSuperAdmins(): Promise<SuperAdminDTO[]> {
      const res = await client.get('/api/Auth/super-adminler');
      return res.data || [];
    },

    async createSuperAdmin(data: any): Promise<SuperAdminDTO> {
      const res = await client.post('/api/Auth/super-adminler', data);
      return res.data;
    },

    async updateSuperAdmin(id: number | string, data: any): Promise<SuperAdminDTO> {
      const res = await client.put(`/api/Auth/super-adminler/${id}`, data);
      return res.data;
    },

    async deleteSuperAdmin(id: number | string): Promise<void> {
      await client.delete(`/api/Auth/super-adminler/${id}`);
    },

    async getRoles(): Promise<RoleDTO[]> {
      const res = await client.get('/api/RolVeYetkiler');
      return res.data || [];
    },

    async getRoleById(id: number | string): Promise<RoleDTO> {
      const res = await client.get(`/api/RolVeYetkiler/${id}`);
      return res.data;
    },

    async saveRole(data: any): Promise<RoleDTO> {
      if (data.id) {
        const res = await client.put(`/api/RolVeYetkiler/${data.id}`, data);
        return res.data;
      } else {
        const res = await client.post('/api/RolVeYetkiler', data);
        return res.data;
      }
    },

    async deleteRole(id: number | string): Promise<void> {
      await client.delete(`/api/RolVeYetkiler/${id}`);
    },

    async canDeleteRole(id: number | string): Promise<boolean> {
      try {
        const res = await client.get(`/api/RolVeYetkiler/${id}/can-delete`);
        return Boolean(res.data?.canDelete ?? true);
      } catch {
        return true;
      }
    },

    async getUsers(params?: any): Promise<UserAuthUserDTO[]> {
      const res = await client.get('/api/Kullanicilar', { params });
      return res.data || [];
    },

    async getUserById(id: number | string): Promise<UserAuthUserDTO> {
      const res = await client.get(`/api/Kullanicilar/${id}`);
      return res.data;
    },

    async saveUser(data: any): Promise<UserAuthUserDTO> {
      if (data.id) {
        const res = await client.put(`/api/Kullanicilar/${data.id}`, data);
        return res.data;
      } else {
        const res = await client.post('/api/Kullanicilar', data);
        return res.data;
      }
    },

    async deleteUser(id: number | string): Promise<void> {
      await client.delete(`/api/Kullanicilar/${id}`);
    }
  };
}

/**
 * Bağımsız yerel test ve demo amacıyla LocalStorage tabanlı adapter.
 */
export function createLocalStorageUserAuthAdapter(): IUserAuthServiceAdapter {
  const SUPER_ADMINS_KEY = 'akalin_user_auth_super_admins';
  const ROLES_KEY = 'akalin_user_auth_roles';
  const USERS_KEY = 'akalin_user_auth_personnel';

  const getSuperAdminsFromStorage = (): SuperAdminDTO[] => {
    try {
      const data = localStorage.getItem(SUPER_ADMINS_KEY);
      return data ? JSON.parse(data) : DEFAULT_SAMPLE_SUPER_ADMINS;
    } catch {
      return DEFAULT_SAMPLE_SUPER_ADMINS;
    }
  };

  const getRolesFromStorage = (): RoleDTO[] => {
    try {
      const data = localStorage.getItem(ROLES_KEY);
      return data ? JSON.parse(data) : DEFAULT_SAMPLE_ROLES;
    } catch {
      return DEFAULT_SAMPLE_ROLES;
    }
  };

  const getUsersFromStorage = (): UserAuthUserDTO[] => {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : DEFAULT_SAMPLE_PERSONNEL;
    } catch {
      return DEFAULT_SAMPLE_PERSONNEL;
    }
  };

  return {
    async getSuperAdmins(): Promise<SuperAdminDTO[]> {
      return getSuperAdminsFromStorage();
    },

    async createSuperAdmin(data: any): Promise<SuperAdminDTO> {
      const list = getSuperAdminsFromStorage();
      const newAdmin: SuperAdminDTO = {
        ...data,
        id: Date.now(),
        adSoyad: `${data.ad || ''} ${data.soyad || ''}`.trim() || data.adSoyad,
        rol: 'Süper Admin',
        durum: 'Aktif'
      };
      list.push(newAdmin);
      localStorage.setItem(SUPER_ADMINS_KEY, JSON.stringify(list));
      return newAdmin;
    },

    async updateSuperAdmin(id: number | string, data: any): Promise<SuperAdminDTO> {
      const list = getSuperAdminsFromStorage();
      const idx = list.findIndex(a => String(a.id) === String(id));
      if (idx === -1) throw new Error('Yönetici bulunamadı.');
      list[idx] = {
        ...list[idx],
        ...data,
        adSoyad: `${data.ad || ''} ${data.soyad || ''}`.trim() || data.adSoyad || list[idx].adSoyad
      };
      localStorage.setItem(SUPER_ADMINS_KEY, JSON.stringify(list));
      return list[idx];
    },

    async deleteSuperAdmin(id: number | string): Promise<void> {
      const list = getSuperAdminsFromStorage();
      const filtered = list.filter(a => String(a.id) !== String(id));
      localStorage.setItem(SUPER_ADMINS_KEY, JSON.stringify(filtered));
    },

    async getRoles(): Promise<RoleDTO[]> {
      return getRolesFromStorage();
    },

    async getRoleById(id: number | string): Promise<RoleDTO> {
      const list = getRolesFromStorage();
      const role = list.find(r => String(r.id) === String(id));
      if (!role) throw new Error('Rol bulunamadı.');
      return role;
    },

    async saveRole(data: any): Promise<RoleDTO> {
      const list = getRolesFromStorage();
      if (data.id) {
        const idx = list.findIndex(r => String(r.id) === String(data.id));
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...data };
          localStorage.setItem(ROLES_KEY, JSON.stringify(list));
          return list[idx];
        }
      }
      const newRole: RoleDTO = {
        ...data,
        id: Date.now(),
        isSystemRole: false,
        userCount: 0
      };
      list.push(newRole);
      localStorage.setItem(ROLES_KEY, JSON.stringify(list));
      return newRole;
    },

    async deleteRole(id: number | string): Promise<void> {
      const list = getRolesFromStorage();
      const filtered = list.filter(r => String(r.id) !== String(id));
      localStorage.setItem(ROLES_KEY, JSON.stringify(filtered));
    },

    async canDeleteRole(): Promise<boolean> {
      return true;
    },

    async getUsers(): Promise<UserAuthUserDTO[]> {
      return getUsersFromStorage();
    },

    async getUserById(id: number | string): Promise<UserAuthUserDTO> {
      const list = getUsersFromStorage();
      const user = list.find(u => String(u.id) === String(id));
      if (!user) throw new Error('Kullanıcı bulunamadı.');
      return user;
    },

    async saveUser(data: any): Promise<UserAuthUserDTO> {
      const list = getUsersFromStorage();
      if (data.id) {
        const idx = list.findIndex(u => String(u.id) === String(data.id));
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...data };
          localStorage.setItem(USERS_KEY, JSON.stringify(list));
          return list[idx];
        }
      }
      const newUser: UserAuthUserDTO = {
        ...data,
        id: Date.now(),
        adSoyad: `${data.ad || ''} ${data.soyad || ''}`.trim(),
        aktifMi: true,
        durum: 'Aktif'
      };
      list.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(list));
      return newUser;
    },

    async deleteUser(id: number | string): Promise<void> {
      const list = getUsersFromStorage();
      const filtered = list.filter(u => String(u.id) !== String(id));
      localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
    }
  };
}

export interface UserAuthModuleContextValue {
  adapter: IUserAuthServiceAdapter;
  setSearchPlaceholder?: (text: string) => void;
  onNotify?: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}

let globalUserAuthConfig: UserAuthModuleContextValue = {
  adapter: createRestUserAuthAdapter(),
  setSearchPlaceholder: () => {}
};

export function setGlobalUserAuthModuleConfig(config: Partial<UserAuthModuleContextValue>): void {
  globalUserAuthConfig = { ...globalUserAuthConfig, ...config };
}

export const UserAuthModuleContext = createContext<UserAuthModuleContextValue>(globalUserAuthConfig);

export const UserAuthModuleProvider: React.FC<{
  value?: Partial<UserAuthModuleContextValue>;
  children: React.ReactNode;
}> = ({ value, children }) => {
  const mergedValue: UserAuthModuleContextValue = {
    ...globalUserAuthConfig,
    ...value,
    adapter: value?.adapter || globalUserAuthConfig.adapter || createRestUserAuthAdapter()
  };

  return (
    <UserAuthModuleContext.Provider value={mergedValue}>
      {children}
    </UserAuthModuleContext.Provider>
  );
};

export function useUserAuthModule(): UserAuthModuleContextValue {
  const ctx = useContext(UserAuthModuleContext);
  return ctx || globalUserAuthConfig;
}

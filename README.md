# @akalin/user_auth_module

Webakus ERP kurumsal ekosistemi için bağımsız, yeniden kullanılabilir ve `@akalin/module_core` (`IModuleDefinition` / `ModuleRegistry`) ile tam uyumlu Kullanıcı, Yetki, Rol ve Süper Admin Yönetimi modülü.

## Özellikler

- **Sistem Süper Yöneticileri**: Platform seviyesindeki süper admin kullanıcılarını listeleme, ekleme, düzenleme ve silme.
- **Rol ve Yetki Matrisi**: `@akalin/module_core` `ModuleRegistry.getPermissionMatrix()` üzerinden dinamik yetki matrisi oluşturma, rol tanımlama ve yetkilendirme.
- **Kullanıcılar & Personel**: Firma içi personel yönetimi, şifre ve hesap aktivasyon işlemleri.
- **Adapter Mimarisi**: REST API ve yerel in-memory adapter desteği ile tam bağımsızlık.
- **UI Standartları**: `@akalin/ui` Material Design 3 bileşenleri ile tam uyum.

## Kurulum

```json
{
  "dependencies": {
    "@akalin/user_auth_module": "github:akalinserhat/akalin-user-auth-module#main"
  }
}
```

## Kullanım

```tsx
import { createUserAuthModule } from '@akalin/user_auth_module';
import { ModuleRegistry } from '@akalin/module_core';

const userAuthModule = createUserAuthModule({
  baseRoute: '/kullanicilar',
  rolesRoute: '/roller'
});

ModuleRegistry.register(userAuthModule);
```

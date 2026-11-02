# Backend package

The backend capability is built as CommonJS JavaScript plus TypeScript declarations.
This is intentional: the NestJS host currently compiles to CommonJS, while the web
entry point remains TypeScript source consumed by Next.js `transpilePackages`.

## Install

```bash
npm install github:wasnaker/bc-region#<immutable-commit-sha>
```

Pin an immutable commit SHA in both `package.json` and `package-lock.json`.
The Git dependency runs `prepare` and builds `api/dist` before installation.

## Register in NestJS

The host supplies an authorization adapter. The module never assumes a fixed
admin role ID or owns the host's role/permission tables.

```ts
import { RegionModule } from '@wasnaker/module-region/api';
import { ModuleRuntimeModule } from './module-runtime/module-runtime.module';
import { ModuleAuthorizationService } from './module-runtime/module-authorization.service';

@Module({
  imports: [
    RegionModule.registerAsync({
      imports: [ModuleRuntimeModule],
      inject: [ModuleAuthorizationService],
      useFactory: (authorization) => ({
        authorize: (roleId, permission) =>
          authorization.hasPermission(roleId, permission),
      }),
    }),
  ],
})
export class AppModule {}
```

The module enforces `read:region`, `create:region`, `update:region` and
`delete:region` at the API boundary. The host owns PostgreSQL, JWT
authentication, role/permission persistence, migration execution and seed
lifecycle. Configure the root NestJS TypeORM connection with
`autoLoadEntities: true`; the module registers its entities through
`TypeOrmModule.forFeature()` and they are then included in the host DataSource. The module owns its controllers, DTOs, domain, services, entities,
repositories, migration and data seed.

## Migrations

Register the exported migration class explicitly in the host TypeORM DataSource:

```ts
import { CreateRegion1793466257948612617 } from
  '@wasnaker/module-region/api/migrations';

migrations: [
  CreateRegion1793466257948612617,
  ...existingMigrations,
]
```

Do not copy module source, entities, migrations, or seeds into the host repository.
The host migration runner executes module migrations against the host PostgreSQL
DataSource. Seed execution remains an explicit host lifecycle operation.

## Build locally

```bash
npm run build:api
npm run verify:api-package
```
